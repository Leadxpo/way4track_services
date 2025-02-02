import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchDto } from './dto/branch.dto';
import { BranchIdDto } from './dto/branch-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer'; // Import multer for memory storage configuration

const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000, // Limit file size to 1GB
    },
};
@Controller('branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) { }
    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @Post('saveBranchDetails')
    async saveBranchDetails(
        @Body() dto: BranchDto,
        @UploadedFile() photo: Express.Multer.File,
    ): Promise<CommonResponse> {
        return this.branchService.saveBranchDetails(dto, photo);
    }
    @Post('deleteBranchDetails')
    async deleteBranchDetails(@Body() dto: BranchIdDto): Promise<CommonResponse> {
        try {
            return this.branchService.deleteBranchDetails(dto);
        } catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }



    @Post('getBranchDetails')
    async getBranchDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return this.branchService.getBranchDetails(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getBranchDetailsById')
    async getBranchDetailsById(@Body() req: BranchIdDto): Promise<CommonResponse> {
        try {
            return this.branchService.getBranchDetailsById(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getBranchStaff')
    async getBranchStaff(@Body() req: BranchIdDto): Promise<CommonResponse> {
        try {
            return this.branchService.getBranchStaff(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getBranchNamesDropDown')
    async getBranchNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.branchService.getBranchNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
}