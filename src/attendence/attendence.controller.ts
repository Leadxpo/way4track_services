import { Body, Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AttendanceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('updateAttendanceDetails')
    async updateAttendanceDetails(@Body() dto: CreateAttendanceDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return this.attendanceService.updateAttendanceDetails(dto);

        } catch (error) {
            console.error('Error in save attendance details:', error);
            return new CommonResponse(false, 500, 'Error saving attendance details');
        }
    }


    @Post('getAttendanceDetails')
    async getAttendanceDetails(): Promise<CommonResponse> {
        try {

            return this.attendanceService.getAttendanceDetails();

        } catch (error) {
            console.error('Error in save attendance details:', error);
            return new CommonResponse(false, 500, 'Error saving attendance details');
        }
    }

    @Post('getAttendanceDetailsById')
    async getAttendanceDetailsById(@Body() req: CreateAttendanceDto): Promise<CommonResponse> {
        try {

            return this.attendanceService.getAttendanceDetailsById(req);

        } catch (error) {
            console.error('Error in save attendance details:', error);
            return new CommonResponse(false, 500, 'Error saving attendance details');
        }
    }

    @Post('getStaffAttendance')
    async getStaffAttendance(
        @Body() req: { staffId?: string; fromDate?: string; toDate?: string; branchName?: string; companyCode?: string; unitCode?: string }
    ) {
        try {
            return this.attendanceService.getStaffAttendance(req);

        } catch (error) {
            console.error('Error in get attendance details:', error);
            return new CommonResponse(false, 500, 'Error fetching attendance details');
        }
    }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAttendance(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            return { message: 'No file uploaded' };
        }
        return await this.attendanceService.processAttendanceExcel(file);
    }

}