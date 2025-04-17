import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { AmenitiesService } from './amenities.service';
import { AmenitiesDto } from './dto/amenities.dto';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';

const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};

@Controller('amenities')
export class AmenitiesController {
    constructor(private readonly service: AmenitiesService) { }

    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @Post('handleAmenitiesDetails')
    async handleAmenitiesDetails(
        @Body() dto: AmenitiesDto,
        @UploadedFile() photo?: Express.Multer.File,
    ): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleAmenitiesDetails(dto, photo);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error saving Amenities details');
        }
    }

    @Post('deleteAmenitiesDetails')
    async deleteAmenitiesDetails(
        @Body() dto: HiringIdDto,
    ): Promise<CommonResponse> {
        try {
            return await this.service.deleteDeviceDetails(dto);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error deleting Amenities');
        }
    }

    @Post('getAmenitiesDetails')
    async getAmenitiesDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.service.getAmenitiesDetails(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Amenities details');
        }
    }

    @Post('getAmenitiesDetailsById')
    async getAmenitiesDetailsById(
        @Body() req: HiringIdDto,
    ): Promise<CommonResponse> {
        try {
            return await this.service.getAmenitiesDetailsById(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Amenities by ID');
        }
    }

    @Post('getAmenitiesDropdown')
    async getAmenitiesDropdown(): Promise<CommonResponse> {
        try {
            return await this.service.getAmenitiesDropdown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching dropdown');
        }
    }
}
