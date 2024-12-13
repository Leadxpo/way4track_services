import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerService } from './sub-dealer.service';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('subdealer')
export class SubDealerController {
    constructor(private readonly subDealerService: SubDealerService) { }

    @Post('saveSubDealerDetails')
    async saveSubDealerDetails(@Body() dto: SubDealerDto) {
        try {
            return await this.subDealerService.saveSubDealerDetails(dto);
        } catch (error) {
            console.log("Error in create address in services..", error)
        }
    }

    @Post('deleteSubDealerDetails')
    async deleteSubDealerDetails(@Body() dto: SubDealerIdDto) {
        try {
            return await this.subDealerService.deleteSubDealerDetails(dto);
        } catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Post('getSubDealerDetails')
    async getSubDealerDetails(@Body() dto: SubDealerIdDto) {
        try {
            return await this.subDealerService.getSubDealerDetails(dto);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching staff type details');
        }
    }

    @Post('getSubDealerNamesDropDown')
    async getSubDealerNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.subDealerService.getSubDealerNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('uploadPhoto')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadPhoto(
        @Body('subDealerId') subDealerId: number,
        @UploadedFile() photo: Express.Multer.File
    ): Promise<CommonResponse> {
        try {
            return await this.subDealerService.uploadSubDealerPhoto(subDealerId, photo);
        } catch (error) {
            console.error('Error uploading subDealer photo:', error);
            return new CommonResponse(false, 500, 'Error uploading photo');
        }
    }

}
