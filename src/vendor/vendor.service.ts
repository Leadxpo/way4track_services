import { Injectable } from '@nestjs/common';
import { VendorDto } from './dto/vendor.dto';
import { VendorIdDto } from './dto/vendor-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { VendorAdapter } from './vendor.adapter';
import { VendorRepository } from './repo/vendor.repo';
import { join } from 'path';
import { promises as fs } from 'fs';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';
import { VendorEntity } from './entity/vendor.entity';

@Injectable()
export class VendorService {
  private storage: Storage;
  private bucketName: string;
  constructor(
    private readonly vendorAdapter: VendorAdapter,
    private readonly vendorRepository: VendorRepository,
  ) {
    this.storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID ||
        'sharontelematics-1530044111318',
      keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
    });

    this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
  }

  private generateVendorId(sequenceNumber: number): string {
    const paddedNumber = sequenceNumber.toString().padStart(3, '0');
    return `v-${paddedNumber}`;
  }
  async updateVendorDetails(dto: VendorDto, filePath: string | null): Promise<CommonResponse> {
    try {
      let existingVendor: VendorEntity | null = null;



      if (dto.id) {
        existingVendor = await this.vendorRepository.findOne({
          where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
        });
      } else if (dto.vendorId) {
        existingVendor = await this.vendorRepository.findOne({
          where: { vendorId: dto.vendorId, companyCode: dto.companyCode, unitCode: dto.unitCode }
        });
      }

      if (!existingVendor) {
        return new CommonResponse(false, 4002, 'Vendor not found for the provided ID.');
      }
      if (filePath && existingVendor.vendorPhoto) {
        const existingFilePath = existingVendor.vendorPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
        const file = this.storage.bucket(this.bucketName).file(existingFilePath);

        try {
          await file.delete();
          console.log(`Deleted old file from GCS: ${existingFilePath}`);
        } catch (error) {
          console.error(`Error deleting old file from GCS: ${error.message}`);
        }
      }

      Object.assign(existingVendor, this.vendorAdapter.convertDtoToEntity(dto));

      await this.vendorRepository.save(existingVendor);

      return new CommonResponse(true, 200, 'Vendor details updated successfully');
    } catch (error) {
      throw new ErrorResponse(500, `Failed to update vendor details: ${error.message}`);
    }
  }

  async createVendorDetails(dto: VendorDto, filePath: string | null): Promise<CommonResponse> {
    try {
      const entity = this.vendorAdapter.convertDtoToEntity(dto);

      if (!entity.vendorId) {
        const allocationCount = await this.vendorRepository.count({});
        entity.vendorId = this.generateVendorId(allocationCount + 1);
      }
      if (filePath) {
        entity.vendorPhoto = filePath;
      }
      await this.vendorRepository.insert(entity);
      return new CommonResponse(true, 201, 'Vendor details created successfully');
    } catch (error) {
      throw new ErrorResponse(500, `Failed to create vendor details: ${error.message}`);
    }
  }

  async handleVendorDetails(dto: VendorDto, photo?: Express.Multer.File): Promise<CommonResponse> {
    try {
      let filePath: string | null = null;
      if (photo) {
        const bucket = this.storage.bucket(this.bucketName);
        const uniqueFileName = `vendor_photos/${Date.now()}-${photo.originalname}`;
        const file = bucket.file(uniqueFileName);

        await file.save(photo.buffer, {
          contentType: photo.mimetype,
          resumable: false,
        });

        console.log(`File uploaded to GCS: ${uniqueFileName}`);
        filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
      }

      if (dto.id && dto.id !== null || (dto.vendorId && dto.vendorId.trim() !== '')) {
        // If an ID or vendorId is provided, update the vendor details
        return await this.updateVendorDetails(dto, filePath);
      } else {
        // If no ID is provided, create a new vendor record
        return await this.createVendorDetails(dto, filePath);
      }
    } catch (error) {
      console.error(`Error handling vendor details: ${error.message}`, error.stack);
      throw new ErrorResponse(5416, `Failed to handle vendor details: ${error.message}`);
    }

  }

  async deleteVendorDetails(dto: VendorIdDto): Promise<CommonResponse> {
    try {
      const vendor = await this.vendorRepository.findOne({ where: { vendorId: dto.vendorId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
      if (!vendor) {
        return new CommonResponse(false, 404, 'Vendor not found');
      }
      await this.vendorRepository.delete(dto.vendorId);
      return new CommonResponse(true, 200, 'Vendor details deleted successfully');

    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getVendorDetailsById(req: VendorIdDto): Promise<CommonResponse> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { vendorId: req.vendorId, companyCode: req.companyCode, unitCode: req.unitCode },
        relations: ['branch'],
      });

      if (!vendor) {
        return new CommonResponse(false, 404, 'Vendor not found');
      }

      const vendorResDto = this.vendorAdapter.convertEntityToDto([vendor])[0];

      return new CommonResponse(true, 200, 'Vendor details fetched successfully', vendorResDto);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getVendorDetails(req: CommonReq): Promise<CommonResponse> {
    try {
      const vendor = await this.vendorRepository.find({
        where: { companyCode: req.companyCode, unitCode: req.unitCode },
        relations: ['branch'],
      });

      if (!vendor) {
        return new CommonResponse(false, 404, 'Vendor not found');
      }

      const vendorResDto = this.vendorAdapter.convertEntityToDto(vendor);

      return new CommonResponse(true, 200, 'Vendor details fetched successfully', vendorResDto);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }


  async getVendorNamesDropDown(): Promise<CommonResponse> {
    const data = await this.vendorRepository.find({ select: ['name', 'id', 'vendorId'] });
    if (data.length) {
      return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
    } else {
      return new CommonResponse(false, 4579, "There Is No branch names")
    }
  }

}
