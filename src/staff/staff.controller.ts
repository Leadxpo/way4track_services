import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { StaffDto } from './dto/staff.dto';
import { StaffIdDto } from './dto/staff-id.dto';
import { StaffService } from './staff-services';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendanceDto } from './dto/attenace-to-staff';
import { CommonReq } from 'src/models/common-req';
@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @UseInterceptors(FileInterceptor('photo'))
    @Post('handleStaffDetails')
    async handleStaffDetails(
        @Body() dto: StaffDto,
        @UploadedFile() photo?: Express.Multer.File,
    ): Promise<CommonResponse> {
        return this.staffService.handleStaffDetails(dto, photo);
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

    @Post('getStaffDetailsById')
    async getStaffDetailsById(@Body() req: StaffIdDto): Promise<CommonResponse> {
        try {
            return this.staffService.getStaffDetailsById(req);
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

    @Post('getStaffDetails')
    async getStaffDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return this.staffService.getStaffDetails(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
}