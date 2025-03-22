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
    private readonly adapter: DesignationAdapter
  ) { }

  async createOrUpdateDesignation(dto: CreateDesignationDto): Promise<DesignationEntity> {
    let designation: DesignationEntity;

    if (dto.id) {
      // If ID is present, find the existing designation
      designation = await this.designationRepository.findOne({ where: { id: dto.id } });

      if (!designation) {
        throw new Error(`Designation with ID ${dto.id} not found.`);
      }

      // Update existing designation
      Object.assign(designation, dto);
    } else {
      // Create new designation
      designation = this.adapter.convertDtoToEntity(dto);
    }

    return await this.designationRepository.save(designation);
  }


  async getDesignation(dto: CreateDesignationDto): Promise<CommonResponse> {
    try {
      console.log(dto,dto.designation, "UUUUUUUUUUUUUUUUUU")
      const des = await this.designationRepository.findOne({
        where: { designation: dto.designation, companyCode: dto.companyCode, unitCode: dto.unitCode }
      });
      console.log(des, ">>>>>>>>>>>>>>")
      if (!des) {
        return new CommonResponse(false, 404, 'Designation not found');
      }

      return new CommonResponse(true, 200, 'Designation details fetched successfully', des);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

  async getAllDesignation(): Promise<CommonResponse> {
    try {
      const des = await this.designationRepository.find();

      if (!des) {
        return new CommonResponse(false, 404, 'Designation not found');
      }

      return new CommonResponse(true, 200, 'Designation details fetched successfully', des);
    } catch (error) {
      throw new ErrorResponse(500, error.message);
    }
  }

}
