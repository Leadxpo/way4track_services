import { DemoLeadService } from './demoLead.service';
import { CommonResponse } from 'src/models/common-response';
import { DemoLeadIdDto } from './dto/demoLead-id.dto';
import { DemoLeadDto } from './dto/demoLead.dto';
import { CommonReq } from 'src/models/common-req';
import {
  Controller, Post, Body, Get, Param, Delete, Put,
} from '@nestjs/common';

@Controller('demoLead')
export class DemoLeadController {
  constructor(private readonly demoLeadService: DemoLeadService) { }
  @Post('handleDemoLeadDetails')
  async handleDemoLeadDetails(@Body() dto: DemoLeadDto,
): Promise<CommonResponse> {
    try {
      if (dto.id && dto.id !== null) {
        dto.id = Number(dto.id);
      }
      return await this.demoLeadService.handleDemoLeadDetails(dto);
    } catch (error) {
      console.error('Error in save demoLead details:', error);
      return new CommonResponse(false, 500, 'Error saving demoLead details');
    }
  }

  @Post('deleteDemoLeadDetails')
  async deleteDemoLeadDetails(@Body() dto: DemoLeadIdDto): Promise<CommonResponse> {
    try {
      return await this.demoLeadService.deleteDemoLeadDetails(dto);
    } catch (error) {
      console.error('Error in delete demoLead details:', error);
      return new CommonResponse(false, 500, 'Error deleting demoLead details');
    }
  }

  @Post('getDemoLeadDetails')
  async getDemoLeadDetails(@Body() dto: DemoLeadIdDto): Promise<CommonResponse> {
    try {
      return await this.demoLeadService.getDemoLeadDetails(dto);
    } catch (error) {
      console.error('Error in get demoLead details:', error);
      return new CommonResponse(false, 500, 'Error fetching demoLead details');
    }
  }

  @Post('getAllDemoLeadDetails')
  async getAllDemoLeadDetails(@Body() dto: CommonReq): Promise<CommonResponse> {
    try {
      return await this.demoLeadService.getAllDemoLeadDetails(dto);
    } catch (error) {
      console.error('Error in get demoLead details:', error);
      return new CommonResponse(false, 500, 'Error fetching demoLead details');
    }
  }
}
