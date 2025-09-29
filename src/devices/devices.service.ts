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

  async handleDeviceDetails(
    dto: DeviceDto,
    mediaFiles?: Express.Multer.File[],
    pointFiles?: Express.Multer.File[],
  ): Promise<CommonResponse> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
  
      // ✅ Upload media files
      const uploadedMediaUrls: string[] = [];
  
      if (mediaFiles?.length) {
        for (const file of mediaFiles) {
          const uniqueFileName = `device_media/${Date.now()}-${file.originalname}`;
          const gcsFile = bucket.file(uniqueFileName);
  
          await gcsFile.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false,
          });
  
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
          uploadedMediaUrls.push(publicUrl);
        }
        dto.image = uploadedMediaUrls;
      }
  
      // ✅ Upload point files and match to dto.points
      if (pointFiles?.length && dto.points?.length) {
        for (let i = 0; i < pointFiles.length; i++) {
          const file = pointFiles[i];
          const uniqueFileName = `device_points/${Date.now()}-${file.originalname}`;
          const gcsFile = bucket.file(uniqueFileName);
  
          await gcsFile.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false,
          });
  
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
  
          // ✅ Assign to corresponding point
          if (dto.points[i]) dto.points[i].file = publicUrl;
        }
      }
  
      if (dto.id) {
        return this.updateDeviceDetails(dto);
      } else {
        return this.createDeviceDetails(dto);
      }
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }
  
  async createDeviceDetails(dto: DeviceDto): Promise<CommonResponse> {
    try {
      const entity = this.adapter.convertDtoToEntity(dto);
     await this.deviceRepository.insert(entity);
      return new CommonResponse(true, 201, 'Device created successfully',entity);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }
  
  async updateDeviceDetails(dto: DeviceDto): Promise<CommonResponse> {
    try {
      const existing = await this.deviceRepository.findOne({ where: { id: dto.id } });
      if (!existing) throw new Error('Device not found');
  
      // ✅ 1. Delete old media files if new ones are uploaded
      if (dto.image?.length && existing.image?.length) {
        for (const oldFile of existing.image) {
          const path = oldFile.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
          const gcsFile = this.storage.bucket(this.bucketName).file(path);
  
          try {
            await gcsFile.delete();
            console.log(`Deleted old media file from GCS: ${path}`);
          } catch (err) {
            console.error(`Error deleting media file from GCS: ${path}`, err.message);
          }
        }
      }
  
      // ✅ 2. Delete old point files if new points are uploaded
      if (dto.points?.length && existing.points?.length) {
        for (const oldPoint of existing.points) {
          if (oldPoint.file) {
            const path = oldPoint.file.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
            const gcsFile = this.storage.bucket(this.bucketName).file(path);
  
            try {
              await gcsFile.delete();
              console.log(`Deleted old point file from GCS: ${path}`);
            } catch (err) {
              console.error(`Error deleting point file from GCS: ${path}`, err.message);
            }
          }
        }
      }
  
      // ✅ 3. Merge new data
      const updated = this.adapter.convertDtoToEntity(dto);
  
      Object.assign(existing, updated);
      await this.deviceRepository.save(existing);
  
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