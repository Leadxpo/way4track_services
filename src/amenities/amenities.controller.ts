import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
    @Post('handleUpdateAmenitiesDetails')
    async handleUpdateAmenitiesDetails(
        @Body() dto: AmenitiesDto,
        @UploadedFile() photo?: Express.Multer.File,
    ): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleUpdateAmenitiesDetails(dto, photo);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error saving Amenities details');
        }
    }

    @Post('handleAmenitiesDetails')
    @UseInterceptors(FilesInterceptor('photos'))
    async handleAmenitiesDetails(
        @Body('dtoList') dtoListString: string,
        @UploadedFiles() photos: Express.Multer.File[],
    ): Promise<CommonResponse> {
        const dtoList = JSON.parse(dtoListString); // Parse incoming string to array
        return this.service.handleBulkAmenities(dtoList, photos);
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
