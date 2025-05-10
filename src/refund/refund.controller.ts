
import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';

import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRefundDto } from './dto/refund.dto';
import { RefundService } from './refund.service';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('Refund')
export class RefundController {
    constructor(private readonly service: RefundService) { }
    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @Post('handleRefundDetails')
    async handleRefundDetails(@Body() dto: CreateRefundDto, @UploadedFile() photo?: Express.Multer.File): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleRefundDetails(dto, photo);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error saving Refund details');
        }
    }

    @Post('deleteRefundDetails')
    async deleteRefundDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteRefundDetails(dto);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error deleting Refund');
        }
    }

    @Post('getRefundDetails')
    async getRefundDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.service.getRefundDetails(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Refund details');
        }
    }

    @Post('getRefundDetailsById')
    async getRefundDetailsById(@Body() req: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getRefundDetailsById(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Refund by ID');
        }
    }
}



