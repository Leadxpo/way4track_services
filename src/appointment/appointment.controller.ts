import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CommonResponse } from 'src/models/common-response';
import { AppointmentIdDto } from './dto/appointment-id.dto';
import { AppointmentDto } from './dto/appointement.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('saveAppointmentDetails')
  async saveAppointmentDetails(@Body() dto: AppointmentDto): Promise<CommonResponse> {
    try {
      return await this.appointmentService.saveAppointmentDetails(dto);
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
}
