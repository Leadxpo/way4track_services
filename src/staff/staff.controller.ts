import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { StaffIdDto } from './dto/staff-id.dto';
import { StaffDto } from './dto/staff.dto';
import { StaffService } from './staff-services';

const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'photo', maxCount: 1 },
            { name: 'resume', maxCount: 1 },
            { name: 'vehiclePhoto', maxCount: 1 },
            { name: 'qualificationFiles', maxCount: 5 }, // Added qualification files
            { name: 'offerLetter', maxCount: 1 },
            { name: 'resignationLetter', maxCount: 1 },
            { name: 'terminationLetter', maxCount: 1 },
            { name: 'appointmentLetter', maxCount: 1 },
            { name: 'leaveFormat', maxCount: 1 },
            { name: 'relievingLetter', maxCount: 1 },
            { name: 'experienceLetter', maxCount: 1 },
            { name: 'experience', maxCount: 5 }

        ], multerOptions)
    )
    @Post('handleStaffDetails')
    async handleStaffDetails(
        @Body() dto: StaffDto,
        @UploadedFiles() files: {
            photo?: Express.Multer.File[],
            resume?: Express.Multer.File[],
            vehiclePhoto?: Express.Multer.File[],
            qualificationFiles?: Express.Multer.File[], // Added qualification files
            offerLetter?: Express.Multer.File[],
            resignationLetter?: Express.Multer.File[],
            terminationLetter?: Express.Multer.File[],
            appointmentLetter?: Express.Multer.File[],
            leaveFormat?: Express.Multer.File[],
            relievingLetter?: Express.Multer.File[],
            experienceLetter?: Express.Multer.File[],
            experience?: Express.Multer.File[]
        }
    ): Promise<CommonResponse> {
        if (dto.id) {
            dto.id = Number(dto.id);
        }

        return this.staffService.handleStaffDetails(dto, files);
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

    @Post('getStaffVerification')
    async getStaffVerification(@Body() dto: StaffDto): Promise<CommonResponse> {
        try {
            return this.staffService.getStaffVerification(dto);
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