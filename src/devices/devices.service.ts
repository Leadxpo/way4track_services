import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { DeviceRepository } from './repo/devices.repo';
import { DeviceDto } from './dto/devices.dto';
import { DeviceAdapter } from './devices.adapter';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class DeviceService {
  private storage: Storage;
  private bucketName: string;
  constructor(private readonly deviceRepository: DeviceRepository,
    private readonly adapter: DeviceAdapter
  ) {
    this.storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID ||
        'sharontelematics-1530044111318',
      keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
    });

    this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
  }

  async handleDeviceDetails(dto: DeviceDto, photo?: Express.Multer.File): Promise<CommonResponse> {
    try {

      let filePath: string | null = null;
      if (photo) {
        const bucket = this.storage.bucket(this.bucketName);
        const uniqueFileName = `device_photos/${Date.now()}-${photo.originalname}`;
        const file = bucket.file(uniqueFileName);

        await file.save(photo.buffer, {
          contentType: photo.mimetype,
          resumable: false,
        });

        // console.log(`File uploaded to GCS: ${uniqueFileName}`);
        filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
      }
      console.log(dto,"testing dto")
      if (dto.id) {
        return this.updateDeviceDetails(dto, filePath);
      } else {
        return this.createDeviceDetails(dto, filePath);
      }
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async createDeviceDetails(dto: DeviceDto, filePath: string | null): Promise<CommonResponse> {
    try {
      const entity = this.adapter.convertDtoToEntity(dto);
      if (filePath) {
        entity.image = filePath;
      }
      await this.deviceRepository.insert(entity);
      return new CommonResponse(true, 201, 'Device created successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async updateDeviceDetails(dto: DeviceDto, filePath: string | null): Promise<CommonResponse> {
    try {
      console.log(dto);
      const existing = await this.deviceRepository.findOne({ where: { id: dto.id } });

      if (!existing) throw new Error('Device not found');

      if (filePath && existing.image) {
        const existingFilePath = existing.image.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
        const file = this.storage.bucket(this.bucketName).file(existingFilePath);

        try {
          await file.delete();
          console.log(`Deleted old file from GCS: ${existingFilePath}`);
        } catch (error) {
          console.error(`Error deleting old file from GCS: ${error.message}`);
        }
      }

      const updated = this.adapter.convertDtoToEntity(dto);
      if (filePath) updated.image = filePath;

      Object.assign(existing, updated);
      await this.deviceRepository.save(existing); // ✅ Save the merged result

      return new CommonResponse(true, 200, 'Device updated successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async deleteDeviceDetails(dto: HiringIdDto): Promise<CommonResponse> {
    try {
      const existing = await this.deviceRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });

      if (!existing) return new CommonResponse(false, 404, 'Device not found');

      await this.deviceRepository.delete({ id: existing.id });
      return new CommonResponse(true, 200, 'Device deleted successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getDeviceDetailsById(req: HiringIdDto): Promise<CommonResponse> {
    try {
      const item = await this.deviceRepository.findOne({
        where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
        relations: ['webProduct'],
      });

      if (!item) return new CommonResponse(false, 404, 'Device not found');
      return new CommonResponse(true, 200, 'Device fetched successfully', item);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getDeviceDetails(req: CommonReq): Promise<CommonResponse> {
    try {
      const items = await this.deviceRepository.find({
        where: { companyCode: req.companyCode, unitCode: req.unitCode },
        relations: ['webProduct'],
      });

      if (!items || !items.length) return new CommonResponse(false, 404, 'Device not found');

      const data = this.adapter.convertEntityToDto(items);
      return new CommonResponse(true, 200, 'Device list fetched', data);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getDeviceDropdown(): Promise<CommonResponse> {
    try {
      const data = await this.deviceRepository.find({
        select: ['id', 'webProductName'],
      });

      if (data.length) {
        return new CommonResponse(true, 200, 'Dropdown fetched', data);
      }

      return new CommonResponse(false, 404, 'No Device entries');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }
}