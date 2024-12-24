import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { HiringDto } from './dto/hiring.dto';
import { HiringService } from './hiring.service';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from './dto/hiring-id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HiringFilterDto } from './dto/hiring-filter.dto';

@Controller('hiring')
export class HiringController {
    constructor(private readonly hiringService: HiringService) { }

    @Post('saveHiringDetailsWithResume')
    @UseInterceptors(FileInterceptor('file'))
    async saveHiringDetailsWithResume(
        @Body() dto: HiringDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<CommonResponse> {
        try {
            return await this.hiringService.saveHiringDetails(dto, file);
        } catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
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

    @Post('getHiringSearchDetails')
    async getHiringSearchDetails(@Body() req: HiringFilterDto) {
        return this.hiringService.getHiringSearchDetails(req);
    }
}
