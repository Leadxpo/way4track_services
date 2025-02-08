import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EstimateDto } from './dto/estimate.dto';
import { CommonResponse } from 'src/models/common-response';
import { EstimateService } from './estimate.service';
import { EstimateIdDto } from './dto/estimate-id.dto';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
import { Storage } from '@google-cloud/storage';

import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('estimate')
export class EstimateController {
    private storage: Storage;
    private bucketName: string;
    constructor(private readonly estimateService: EstimateService) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    @Post('handleEstimateDetails')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'estimatePdf', maxCount: 1 },
        { name: 'invoicePDF', maxCount: 1 }
    ], multerOptions))
    async handleEstimateDetails(
        @Body() dto: EstimateDto,
        @UploadedFiles() files: { estimatePdf?: Express.Multer.File[], invoicePDF?: Express.Multer.File[] }
    ): Promise<CommonResponse> {
        try {
            let estimatePath: string | null = null;
            let invoicePath: string | null = null;

            if (files?.estimatePdf?.length) {
                estimatePath = await this.uploadFileToGCS(files.estimatePdf[0], 'estimate_Pdfs');
            }

            if (files?.invoicePDF?.length) {
                invoicePath = await this.uploadFileToGCS(files.invoicePDF[0], 'invoice_Pdfs');
            }

            return dto.id && dto.estimateId?.trim()
                ? await this.estimateService.updateEstimateDetails(dto, estimatePath, invoicePath)
                : await this.estimateService.createEstimateDetails(dto, estimatePath);
        } catch (error) {
            console.error('Error in handleEstimateDetails:', error);
            return new CommonResponse(false, 500, 'Error handling estimate details');
        }
    }
    private async uploadFileToGCS(file: Express.Multer.File, folder: string): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const uniqueFileName = `${folder}/${Date.now()}-${file.originalname}`;
        const gcsFile = bucket.file(uniqueFileName);

        await gcsFile.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false,
        });

        await gcsFile.makePublic();
        console.log(`File uploaded to GCS: ${uniqueFileName}`);

        return `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
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
