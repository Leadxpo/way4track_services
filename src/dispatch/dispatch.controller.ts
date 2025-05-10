import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { DispatchService } from './dispatch.service';
import { DispatchDto } from './dto/dispatch.dto';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('dispatch')
export class DispatchController {
    constructor(private readonly dispatchService: DispatchService) { }

    @Post('handleDispatchDetails')
    @UseInterceptors(FileInterceptor('dispatchBoximage', multerOptions))
    async handleDispatchDetails(@Body() dto: DispatchDto, @UploadedFile() dispatchBoximage?: Express.Multer.File) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return this.dispatchService.handleDispatchDetails(dto, dispatchBoximage);

        } catch (error) {
            console.error('Error in save vendor details:', error);
            return new CommonResponse(false, 500, 'Error saving vendor details');
        }
    }

    @Post('getDispatchDetails')
    async getDispatchDetails(@Body() dto: CommonReq) {
        try {
            return this.dispatchService.getDispatchDetails(dto);
        } catch (error) {
            console.error('Error in get vendor details:', error);
            return new CommonResponse(false, 500, 'Error fetching vendor details');
        }
    }

    @Post('getDispatchDetailsById')
    async getDispatchDetailsById(@Body() dto: HiringIdDto) {
        try {
            return this.dispatchService.getDispatchDetailsById(dto);
        } catch (error) {
            console.error('Error in get vendor details:', error);
            return new CommonResponse(false, 500, 'Error fetching vendor details');
        }
    }

    @Post('deleteDispatch')
    async deleteDispatch(@Body() dto: HiringIdDto) {
        try {
            return this.dispatchService.deleteDispatch(dto);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getDispatchData')
    async getDispatchData(@Body() dto: {
        fromDate?: string;
        toDate?: string;
        transportId?: string;
        companyCode?: string;
        unitCode?: string
    }) {
        try {
            return this.dispatchService.getDispatchData(dto);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
}
