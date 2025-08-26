import { AppointmentService } from './appointment.service';
import { CommonResponse } from 'src/models/common-response';
import { AppointmentIdDto } from './dto/appointment-id.dto';
import { AppointmentDto } from './dto/appointement.dto';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
import {
  Controller, Post, Body, Get, Param, Delete, Put, UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 1000000000,
  },
};


@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }
  @UseInterceptors(FilesInterceptor('photo', 10, multerOptions))
  @Post('handleAppointmentDetails')
  async handleAppointmentDetails(@Body() dto: AppointmentDto,
  @UploadedFiles() photo: Express.Multer.File[],
): Promise<CommonResponse> {
    try {
      if (dto.id && dto.id !== null) {
        dto.id = Number(dto.id);
      }
      return await this.appointmentService.handleAppointmentDetails(dto,photo);
    } catch (error) {
      console.error('Error in save appointment details:', error);
      return new CommonResponse(false, 500, 'Error saving appointment details');
    }
  }

  @Post('deleteAppointmentDetails')
  async deleteAppointmentDetails(@Body() dto: AppointmentIdDto): Promise<CommonResponse> {
    try {
      return await this.appointmentService.deleteAppointmentDetails(dto);
    } catch (error) {
      console.error('Error in delete appointment details:', error);
      return new CommonResponse(false, 500, 'Error deleting appointment details');
    }
  }

  @Post('getAppointmentDetails')
  async getAppointmentDetails(@Body() dto: AppointmentIdDto): Promise<CommonResponse> {
    try {
      return await this.appointmentService.getAppointmentDetails(dto);
    } catch (error) {
      console.error('Error in get appointment details:', error);
      return new CommonResponse(false, 500, 'Error fetching appointment details');
    }
  }

  @Post('getAllAppointmentDetails')
  async getAllAppointmentDetails(@Body() dto: CommonReq): Promise<CommonResponse> {
    try {
      return await this.appointmentService.getAllAppointmentDetails(dto);
    } catch (error) {
      console.error('Error in get appointment details:', error);
      return new CommonResponse(false, 500, 'Error fetching appointment details');
    }
  }
}
