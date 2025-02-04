import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerService } from './sub-dealer.service';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};

@Controller('subdealer')
export class SubDealerController {
    constructor(private readonly subDealerService: SubDealerService) { }

    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @Post('handleSubDealerDetails')
    async handleSubDealerDetails(@Body() dto: SubDealerDto, @UploadedFile() photo?: Express.Multer.File) {
        try {
            return await this.subDealerService.handleSubDealerDetails(dto, photo);
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

    @Post('getSubDealerDetailById')
    async getSubDealerDetailById(@Body() dto: SubDealerIdDto) {
        try {
            return await this.subDealerService.getSubDealerDetailById(dto);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching staff type details');
        }
    }

    @Post('getSubDealerDetails')
    async getSubDealerDetails(@Body() dto: CommonReq) {
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

}
