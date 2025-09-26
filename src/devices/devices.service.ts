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
    photos?: Express.Multer.File[],
    applicationPhotos?: Express.Multer.File[],
  ): Promise<CommonResponse> {
    try {

      let imageUrls: { image: string }[] = [];
      let applicationPhotoUrls: string[] = [];
      
      const bucket = this.storage.bucket(this.bucketName);
      
      if (photos && photos.length > 0) {
        
        for (const photo of photos) {
          const uniqueFileName = `device_photos/${Date.now()}-${Math.random()}-${photo.originalname}`;
          const file = bucket.file(uniqueFileName);

          await file.save(photo.buffer, {
            contentType: photo.mimetype,
            resumable: false,
          });

          const filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
          imageUrls.push({ image: filePath });
        }
      }

      if (applicationPhotos?.length && dto.applications?.length) {
        for (let i = 0; i < applicationPhotos.length; i++) {
          const photo = applicationPhotos[i];
          if (!dto.applications[i]) continue;

          const uniqueFileName = `application_photos/${Date.now()}-${Math.random()}-${photo.originalname}`;
          const file = bucket.file(uniqueFileName);
          await file.save(photo.buffer, { 
            contentType: photo.mimetype, 
            resumable: false 
          });
  
          // Only replace photo for this index
          const filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
          dto.applications[i].photo = filePath
        }
      }

      console.log(dto,"testing dto")
      if (dto.id) {
        return this.updateDeviceDetails(dto, imageUrls);
      } else {
        return this.createDeviceDetails(dto, imageUrls);
      }
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async createDeviceDetails(
    dto: DeviceDto, 
    imageUrls: { image: string }[]
  ): Promise<CommonResponse> {
    try {
      const entity = this.adapter.convertDtoToEntity(dto);
      
      if (imageUrls.length > 0) {
        entity.images = imageUrls;
      }
      
      if (dto.applications && dto.applications.length > 0) {
        entity.applications = dto.applications;
      }

      await this.deviceRepository.insert(entity);
      return new CommonResponse(true, 201, 'Device created successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async updateDeviceDetails(dto: DeviceDto, imageUrls: { image: string }[]): Promise<CommonResponse> {
    try {
      console.log(dto);
      const existing = await this.deviceRepository.findOne({ where: { id: dto.id } });

      if (!existing) throw new Error('Device not found');

      if (imageUrls.length > 0 && existing.images && existing.images.length > 0) {
         for (const oldImage of existing.images) {
          const existingFilePath = oldImage.image.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
          const file = this.storage.bucket(this.bucketName).file(existingFilePath);

          try {
            await file.delete();
            console.log(`Deleted old file from GCS: ${existingFilePath}`);
          } catch (error) {
            console.error(`Error deleting old file from GCS: ${error.message}`);
          }
        }
      }

      if (dto.applications?.length && existing.applications?.length) {
        for (let i = 0; i < dto.applications.length; i++) {
          const newPhoto = dto.applications[i].photo;
          const oldPhoto = existing.applications[i]?.photo;

          if (newPhoto && oldPhoto) {
            const existingFilePath = oldPhoto.replace(
              `https://storage.googleapis.com/${this.bucketName}/`, 
              ''
            );
            const file = this.storage.bucket(this.bucketName).file(existingFilePath);
            
            try {
              await file.delete();
              console.log(`Deleted old application photo: ${existingFilePath}`);
            } catch (error) {
              console.error(`Error deleting application photo from GCS: ${error.message}`);
            }
          }
        }
      }

      const updated = this.adapter.convertDtoToEntity(dto);
      if (imageUrls.length > 0) {
        updated.images = imageUrls;
      }

      if (dto.applications?.length > 0) {
        updated.applications = dto.applications;
      }

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