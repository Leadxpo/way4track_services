import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignationRepository } from './repo/designation.repo';
import { CreateDesignationDto } from './dto/designation.dto';
import { DesignationEntity } from './entity/designation.entity';
import { DesignationAdapter } from './designation.adapter';
import { ErrorResponse } from 'src/models/error-response';
import { CommonResponse } from 'src/models/common-response';


@Injectable()
export class DesignationService {
  constructor(
   
    private readonly designationRepository: DesignationRepository,
    private readonly adapter:DesignationAdapter
  ) {}

  async createDesignation(dto: CreateDesignationDto): Promise<DesignationEntity> {
    const newDesignation = this.adapter.convertDtoToEntity(dto);
    return await this.designationRepository.save(newDesignation);
  }

  async getDesignation(dto: CreateDesignationDto): Promise<CommonResponse> {
    try {
        const des = await this.designationRepository.findOne({
            where: { designation: dto.designation, companyCode: dto.companyCode, unitCode: dto.unitCode }
        });

        if (!des) {
            return new CommonResponse(false, 404, 'Designation not found');
        }

        return new CommonResponse(true, 200, 'Designation details fetched successfully', des);
    } catch (error) {
        throw new ErrorResponse(500, error.message);
    }
}

}
