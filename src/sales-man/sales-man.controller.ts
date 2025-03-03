import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { SalesWorksService } from './sales-man.service';
import { SalesWorksDto } from './dto/sales-man.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CommonResponse } from 'src/models/common-response';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('sales-works')
export class SalesWorksController {
    constructor(private readonly salesWorksService: SalesWorksService) {}

    @Post('getAll')
    async getAll(): Promise<SalesWorksDto[]> {
        return this.salesWorksService.findAll();
    }

    @Post('getById')
    async getById(@Body() id: number): Promise<SalesWorksDto> {
        return this.salesWorksService.findOne(id);
    }

     @UseInterceptors(
            FileFieldsInterceptor(
                [
                    { name: 'visitingCard', maxCount: 1 },
                    { name: 'clientPhoto', maxCount: 1 },
                ],
                multerOptions
            )
        )
    @Post('handleSales')
    async handleSales(@Body() dto: SalesWorksDto,
 @UploadedFiles() files: {
    visitingCard?: Express.Multer.File[],
    clientPhoto?: Express.Multer.File[],
           
        }): Promise<CommonResponse> {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
        return this.salesWorksService.handleSales(dto,files);
    }

    
    @Post('delete')
    async delete(@Body() id: number): Promise<void> {
        return this.salesWorksService.delete(id);
    }
}
