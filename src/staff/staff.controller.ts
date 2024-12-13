import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { StaffDto } from './dto/staff.dto';
import { StaffIdDto } from './dto/staff-id.dto';
import { StaffService } from './staff-services';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendanceDto } from './dto/attenace-to-staff';
@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post('saveStaffDetails')
    async saveStaffDetails(@Body() req: any): Promise<CommonResponse> {
        try {
            return this.staffService.saveStaffDetails(req);
        } catch (error) {
            console.log("Error in create address in services..", error)
        }
    }

    @Post('deletestaffDetails')
    async deletestaffDetails(@Body() dto: StaffIdDto): Promise<CommonResponse> {
        try {
            return this.staffService.deleteStaffDetails(dto);
        } catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Post('getstaffDetails')
    async getstaffDetails(@Body() req: StaffIdDto): Promise<CommonResponse> {
        try {
            return this.staffService.getStaffDetails(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching staff type details');
        }
    }

    @Post('getStaffNamesDropDown')
    async getStaffNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.staffService.getStaffNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('uploadPhoto')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadPhoto(
        @Body('staffId') staffId: number,
        @UploadedFile() photo: Express.Multer.File
    ): Promise<CommonResponse> {
        try {
            return await this.staffService.uploadStaffPhoto(staffId, photo);
        } catch (error) {
            console.error('Error uploading staff photo:', error);
            return new CommonResponse(false, 500, 'Error uploading photo');
        }
    }

}