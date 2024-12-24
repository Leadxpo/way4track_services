import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchDto } from './dto/branch.dto';
import { BranchIdDto } from './dto/branch-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('branch')
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @Post('saveBranchDetails')
    async saveBranchDetails(@Body() dto: BranchDto): Promise<CommonResponse> {
        try {
            return this.branchService.saveBranchDetails(dto);
        } catch (error) {
            console.log("Error in create address in services..", error)
        }
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
    async getBranchDetails(@Body() req: BranchIdDto): Promise<CommonResponse> {
        try {
            return this.branchService.getBranchDetails(req);
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

    @Post('uploadPhoto')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadPhoto(
        @Body('branchId') branchId: number,
        @UploadedFile() photo: Express.Multer.File
    ): Promise<CommonResponse> {
        try {
            return await this.branchService.uploadBranchPhoto(branchId, photo);
        } catch (error) {
            console.error('Error uploading branch photo:', error);
            return new CommonResponse(false, 500, 'Error uploading photo');
        }
    }
}