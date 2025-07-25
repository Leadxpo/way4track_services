import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/login/dto/login.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerRepository } from './repo/sub-dealer.repo';
import { SubDealerAdapter } from './sub-dealer.adapter';
import { SubDealerEntity } from './entity/sub-dealer.entity';
import { StaffStatus } from 'src/staff/enum/staff-status';

@Injectable()
export class SubDealerService {
  private storage: Storage;
  private bucketName: string;
  constructor(
    private readonly subDealerAdapter: SubDealerAdapter,
    private readonly subDealerRepository: SubDealerRepository,
  ) {
    this.storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID ||
        'sharontelematics-1530044111318',
      keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
    });

    this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
  }



  private generateSubDealerId(sequenceNumber: number): string {
    const paddedNumber = sequenceNumber.toString().padStart(3, '0');
    return `SD-${paddedNumber}`;
  }

  async updateSubDealerDetails(dto: SubDealerDto, filePath: string | null): Promise<CommonResponse> {
    try {

      let existingSubDealer: SubDealerEntity | null = null;



      if (dto.id) {
        existingSubDealer = await this.subDealerRepository.findOne({
          where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
        });
      } else if (dto.subDealerId) {
        existingSubDealer = await this.subDealerRepository.findOne({
          where: { subDealerId: dto.subDealerId, companyCode: dto.companyCode, unitCode: dto.unitCode }
        });
      }


      if (!existingSubDealer) {
        return new CommonResponse(false, 4002, 'SubDealer not found for the provided ID.');
      }
      if (filePath && existingSubDealer.subDealerPhoto) {
        const existingFilePath = existingSubDealer.subDealerPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
        const file = this.storage.bucket(this.bucketName).file(existingFilePath);

        try {
          await file.delete();
          console.log(`Deleted old file from GCS: ${existingFilePath}`);
        } catch (error) {
          console.error(`Error deleting old file from GCS: ${error.message}`);
        }
      }
      Object.assign(existingSubDealer, this.subDealerAdapter.convertDtoToEntity(dto));
      await this.subDealerRepository.save(existingSubDealer);

      return new CommonResponse(true, 200, 'SubDealer details updated successfully');
    } catch (error) {
      throw new ErrorResponse(500, `Failed to update subdealer details: ${error.message}`);
    }
  }

  async createSubDealerDetails(dto: SubDealerDto, filePath: string | null): Promise<CommonResponse> {
    try {
      const entity = this.subDealerAdapter.convertDtoToEntity(dto);

      if (!entity.subDealerId) {
        const allocationCount = await this.subDealerRepository.count({});
        entity.subDealerId = this.generateSubDealerId(allocationCount + 1);
      }
      if (filePath) {
        entity.subDealerPhoto = filePath;
      }
      await this.subDealerRepository.insert(entity);
      return new CommonResponse(true, 201, 'SubDealer details created successfully');
    } catch (error) {
      console.log(error);
      throw new ErrorResponse(500, `Failed to create subdealer details: ${error.message}`);
    }
  }

  async handleSubDealerDetails(dto: SubDealerDto, photo?: Express.Multer.File): Promise<CommonResponse> {
    try {
      let filePath: string | null = null;
      if (photo) {
        const bucket = this.storage.bucket(this.bucketName);
        const uniqueFileName = `subDealer_photos/${Date.now()}-${photo.originalname}`;
        const file = bucket.file(uniqueFileName);

        await file.save(photo.buffer, {
          contentType: photo.mimetype,
          resumable: false,
        });

        console.log(`File uploaded to GCS: ${uniqueFileName}`);
        filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
      }


      if (dto.id && dto.id !== null || (dto.subDealerId && dto.subDealerId.trim() !== '')) {
        return await this.updateSubDealerDetails(dto, filePath);
      } else {
        return await this.createSubDealerDetails(dto, filePath);
      }
    } catch (error) {
      console.error(`Error handling staff details: ${error.message}`, error.stack);
      throw new ErrorResponse(5416, `Failed to handle staff details: ${error.message}`);
    }

  }

  async deleteSubDealerDetails(dto: SubDealerIdDto): Promise<CommonResponse> {
    try {
      const subDealer = await this.subDealerRepository.findOne({
        where: { subDealerId: dto.subDealerId, companyCode: dto.companyCode, unitCode: dto.unitCode }
      });

      if (!subDealer) {
        return new CommonResponse(false, 404, 'SubDealer not found');
      }

      await this.subDealerRepository.update(
        { subDealerId: subDealer.subDealerId },
        { status: StaffStatus.INACTIVE }
      );

      return new CommonResponse(true, 200, 'SubDealer details deleted successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }


  async getSubDealerDetails(req: CommonReq): Promise<CommonResponse> {
    try {
      const subDealer = await this.subDealerRepository.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch'],
        order: {
          createdAt: 'DESC'  // <- this is what adds the descending sort
      } });
      if (!subDealer) {
        return new CommonResponse(false, 404, 'SubDealer not found');
      }
      const resDto = this.subDealerAdapter.convertEntityToDto(subDealer);

      return new CommonResponse(true, 200, 'SubDealer details fetched successfully', subDealer);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getSubDealerDetailById(req: SubDealerIdDto): Promise<CommonResponse> {
    try {
      const subDealer = await this.subDealerRepository.findOne({ where: { subDealerId: req.subDealerId, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch'] });
      if (!subDealer) {
        return new CommonResponse(false, 404, 'SubDealer not found');
      }
      const resDto = this.subDealerAdapter.convertEntityToDto([subDealer])[0];

      return new CommonResponse(true, 200, 'SubDealer details fetched successfully', resDto);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getSubDealerNamesDropDown(): Promise<CommonResponse> {
    const data = await this.subDealerRepository.find({ select: ['name', 'id', 'subDealerId'] });
    if (data.length) {
      return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
    } else {
      return new CommonResponse(false, 4579, "There Is No branch names")
    }
  }

  async getSubDealerProfileDetails(req: LoginDto): Promise<CommonResponse> {
    try {
      const subDealer = await this.subDealerRepository.findOne({ where: { subDealerId: req.staffId, password: req.password, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch', 'permissions'] });
      if (!subDealer) {
        return new CommonResponse(false, 404, 'SubDealer not found');
      }
      // const resDto = this.subDealerAdapter.convertEntityToDto(subDealer);

      return new CommonResponse(true, 200, 'SubDealer details fetched successfully', subDealer);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

}
