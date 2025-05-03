import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CreatePromotionDto } from './dto/promotional.dto';
import { CommonResponse } from 'src/models/common-response';
import { PromotionService } from './promotional.service';
import { TechIdDto } from 'src/technician-works/dto/technician-id.dto';

const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000, // 1GB
    },
};

@Controller('promotion')
export class PromotionController {
    constructor(private readonly service: PromotionService) { }

    @Post('handlePromotionDetails')
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'photo', maxCount: 10 },
            { name: 'image', maxCount: 1 },
        ],
        multerOptions
    ))

    async handlePromotionDetails(
        @Body() dto: CreatePromotionDto,
        @UploadedFiles()
        files: {
            photo?: Express.Multer.File[],
            image?: Express.Multer.File[],
        }
    ): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }

            return this.service.handleTechnicianDetails(dto, files);
        } catch (error) {
            console.error(error);
            return new CommonResponse(false, 500, 'Error handling promotion details');
        }
    }

    @Post('getAllPromotions')
    async getAllPromotions(): Promise<CommonResponse> {
        try {
            return await this.service.findAll();
        } catch (error) {
            console.error(error);
            return new CommonResponse(false, 500, 'Error fetching promotions');
        }
    }

    @Post('getPromotionById')
    async getPromotionById(
        @Body() req: TechIdDto
    ): Promise<CommonResponse> {
        try {
            return await this.service.findOne(req);
        } catch (error) {
            console.error(error);
            return new CommonResponse(false, 500, 'Error fetching promotion by ID');
        }
    }

    @Post('deletePromotion')
    async deletePromotion(
        @Body() req: TechIdDto
    ): Promise<CommonResponse> {
        try {
            await this.service.remove(req.id);
            return new CommonResponse(true, 200, 'Promotion deleted successfully');
        } catch (error) {
            console.error(error);
            return new CommonResponse(false, 500, 'Error deleting promotion');
        }
    }
}
