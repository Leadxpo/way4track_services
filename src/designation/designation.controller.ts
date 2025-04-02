import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/designation.dto';
import { DesignationEntity } from './entity/designation.entity';
import { CommonResponse } from 'src/models/common-response';


@Controller('designations')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) { }

  @Post('createDesignation')
  async createDesignation(@Body() dto: CreateDesignationDto): Promise<DesignationEntity> {
    return this.designationService.createOrUpdateDesignation(dto);
  }

  @Post('getDesignation')
  async getDesignation(@Body() req: CreateDesignationDto): Promise<CommonResponse> {
    try {
      return await this.designationService.getDesignation(req);
    } catch (error) {
      console.error('Error in get vendor details:', error);
      return new CommonResponse(false, 500, 'Error fetching vendor details');
    }
  }

  @Post('getAllDesignation')
  async getAllDesignation(): Promise<CommonResponse> {
    try {
      return await this.designationService.getAllDesignation();
    } catch (error) {
      console.error('Error in get vendor details:', error);
      return new CommonResponse(false, 500, 'Error fetching vendor details');
    }
  }

  @Post('deleteDesignation')
  async deleteDesignation(@Body() req: CreateDesignationDto): Promise<CommonResponse> {
    try {
      return this.designationService.deleteDesignation(req);
    } catch (error) {
      console.log("Error in create designation in services..", error);
      return new CommonResponse(false, 500, 'Error fetching designation type details');
    }
  }
}
