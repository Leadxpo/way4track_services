import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import * as multer from 'multer';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { EstimateIdDto } from './dto/estimate-id.dto';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateService } from './estimate.service';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('estimate')
export class EstimateController {
    constructor(private readonly estimateService: EstimateService) { }


    @Post('handleEstimateDetails')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'estimatePdf', maxCount: 1 },
        { name: 'invoicePDF', maxCount: 1 }
    ], multerOptions))
    async handleEstimateDetails(
        @Body() dto: EstimateDto,
        @UploadedFiles() files: { estimatePdf?: Express.Multer.File[], invoicePDF?: Express.Multer.File[] }
    ): Promise<CommonResponse> {
        if (dto.id) {
            dto.id = Number(dto.id);
        }
        try {
            return await this.estimateService.uploadAndHandleEstimateDetails(dto, files);
        } catch (error) {
            console.error('Error in handleEstimateDetails:', error);
            return new CommonResponse(false, 500, 'Error handling estimate details');
        }
    }

    @Post('deleteEstimateDetails')
    async deleteEstimateDetails(@Body() dto: EstimateIdDto): Promise<CommonResponse> {
        try {
            return await this.estimateService.deleteEstimateDetails(dto);
        } catch (error) {
            console.error('Error in delete estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting estimate details');
        }
    }

    @Post('getEstimateDetails')
    async getEstimateDetails(@Body() req: EstimateIdDto): Promise<CommonResponse> {
        try {
            return await this.estimateService.getEstimateDetails(req);
        } catch (error) {
            console.error('Error in get estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching estimate details');
        }
    }

    @Post('getInvoiceDetails')
    async getInvoiceDetails(@Body() req: EstimateIdDto): Promise<CommonResponse> {
        try {
            return await this.estimateService.getInvoiceDetails(req);
        } catch (error) {
            console.error('Error in get estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching estimate details');
        }
    }

    @Post('getEstimatPrefixeDetails')
    async getEstimatPrefixeDetails(@Body() req: EstimateIdDto): Promise<CommonResponse> {
        try {
            return await this.estimateService.getEstimatePrefixDetails(req);
        } catch (error) {
            console.error('Error in get estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching estimate details');
        }
    }

    @Post('getEstimatInvoicePrefixeDetails')
    async getEstimatInvoicePrefixeDetails(@Body() req: EstimateIdDto): Promise<CommonResponse> {
        try {
            return await this.estimateService.getEstimatInvoicePrefixeDetails(req);
        } catch (error) {
            console.error('Error in get estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching estimate details');
        }
    }

    @Post('getAllEstimateDetails')
    async getAllEstimateDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.estimateService.getAllEstimateDetails(req);
        } catch (error) {
            console.error('Error in get estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching estimate details');
        }
    }
}
