import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { HiringDto } from './dto/hiring.dto';
import { HiringService } from './hiring.service';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from './dto/hiring-id.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('hiring')
export class HiringController {
    constructor(private readonly hiringService: HiringService) { }

    @Post('saveHiringDetails')
    async saveHiringDetails(@Body() dto: HiringDto): Promise<CommonResponse> {
        try {
            return await this.hiringService.saveHiringDetails(dto);
        } catch (error) {
            console.error('Error in save hiring details in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details');
        }
    }

    @Post('deleteHiringDetails')
    async deleteHiringDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.hiringService.deleteHiringDetails(dto);
        } catch (error) {
            console.error('Error in delete hiring details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting hiring details');
        }
    }

    @Post('getHiringDetails')
    async getHiringDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.hiringService.getHiringDetails(dto);
        } catch (error) {
            console.error('Error in get hiring details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching hiring details');
        }
    }

    @Post('uploadResume')
    @UseInterceptors(FileInterceptor('file'))
    async uploadResume(@Body() hiringId: number, @UploadedFile() file: Express.Multer.File): Promise<CommonResponse> {
        try {
            return await this.hiringService.uploadResume(hiringId, file);
        } catch (error) {
            console.error('Error in upload resume in service:', error);
            return new CommonResponse(false, 500, 'Error uploading resume');
        }
    }
}
