import { Body, Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AttendanceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    // @Post('createAttendance')
    // async createAttendance(@Body() dto: CreateAttendanceDto): Promise<CommonResponse> {
    //     try {
    //         if (dto.id) {
    //             dto.id = Number(dto.id);
    //         }
    //         return this.attendanceService.saveAttendance(dto);

    //     } catch (error) {
    //         console.error('Error in save attendance details:', error);
    //         return new CommonResponse(false, 500, 'Error saving attendance details');
    //     }
    // }

    // @Post('getAttendance')
    // async getAttendance(
    //     @Body() req: { staffId?: string, branchId?: number, dateRange?: { start: string, end: string }, companyCode?: string, unitCode?: string }
    // ) {
    //     try {
    //         return this.attendanceService.getAttendance(req);

    //     } catch (error) {
    //         console.error('Error in get attendance details:', error);
    //         return new CommonResponse(false, 500, 'Error fetching attendance details');
    //     }
    // }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAttendance(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            return { message: 'No file uploaded' };
        }
        return await this.attendanceService.processAttendanceExcel(file);
    }

}