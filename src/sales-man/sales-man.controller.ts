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
    constructor(private readonly salesWorksService: SalesWorksService) { }

    @Post('getAll')
    async getAll(): Promise<CommonResponse> {
        try {
            return await this.salesWorksService.findAll();

        } catch (error) {
            console.error('Error in get request details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching request details');
        }
    }

    @Post('getById')
    async getById(@Body() dto: SalesWorksDto): Promise<CommonResponse> {
        try {
            return await this.salesWorksService.findOne(dto);

        } catch (error) {
            console.error('Error in get request details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching request details');
        }
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
        return this.salesWorksService.handleSales(dto, files);
    }


    @Post('delete')
    async delete(@Body() id: number): Promise<void> {
        return this.salesWorksService.delete(id);
    }


    @Post('getSalesSearchDetails')
    async getSalesSearchDetails(@Body() req: { companyCode: string; unitCode: string; staffId?: string; name?: string, branch?: string }): Promise<CommonResponse> {
        try {
            return await this.salesWorksService.getSalesSearchDetails(req)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            // return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
}
