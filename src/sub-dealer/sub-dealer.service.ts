import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { SubDealerAdapter } from './sub-dealer.adapter';
import { SubDealerRepository } from './repo/sub-dealer.repo';
import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class SubDealerService {
  constructor(
    private readonly subDealerAdapter: SubDealerAdapter,
    private readonly subDealerRepository: SubDealerRepository,
  ) { }



  private generateSubDealerId(sequenceNumber: number): string {
    const paddedNumber = sequenceNumber.toString().padStart(3, '0');
    return `SD-${paddedNumber}`;
  }

  async updateSubDealerDetails(dto: SubDealerDto, filePath: string | null): Promise<CommonResponse> {
    try {
      const existingSubDealer = await this.subDealerRepository.findOne({
        where: { id: dto.id, subDealerId: dto.subDealerId, companyCode: dto.companyCode, unitCode: dto.unitCode },
      });

      if (!existingSubDealer) {
        return new CommonResponse(false, 4002, 'SubDealer not found for the provided ID.');
      }
      if (filePath) {
        existingSubDealer.subDealerPhoto = filePath;
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
      console.log(filePath, "+++")
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
        filePath = join(__dirname, '../.../uploads/subDealer_photos', `${Date.now()}-${photo.originalname}`);
        await fs.writeFile(filePath, photo.fieldname)
      }
      if (dto.id || dto.subDealerId) {
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
      const subDealer = await this.subDealerRepository.findOne({ where: { subDealerId: dto.subDealerId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
      if (!subDealer) {
        return new CommonResponse(false, 404, 'SubDealer not found');
      }
      await this.subDealerRepository.delete(dto.subDealerId);
      return new CommonResponse(true, 200, 'SubDealer details deleted successfully');
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getSubDealerDetails(req: SubDealerIdDto): Promise<CommonResponse> {
    try {
      const subDealer = await this.subDealerRepository.findOne({ where: { subDealerId: req.subDealerId, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['voucherId', 'branch'] });
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

}
