import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { HiringDto } from './dto/hiring.dto';
import { HiringService } from './hiring.service';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from './dto/hiring-id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HiringFilterDto } from './dto/hiring-filter.dto';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('hiring')
export class HiringController {
    constructor(private readonly hiringService: HiringService) { }

    @Post('saveHiringDetailsWithResume')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async saveHiringDetailsWithResume(
        @Body() dto: HiringDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.hiringService.saveHiringDetails(dto, file);
        } catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }

    @Post('getCandidatesStatsLast30Days')
    async getCandidatesStatsLast30Days(@Body() req: CommonReq) {
        return await this.hiringService.getCandidatesStatsLast30Days(req);
    }

    @Post('getHiringTodayDetails')
    async getHiringTodayDetails(@Body() req: CommonReq) {
        return await this.hiringService.getHiringTodayDetails(req);
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

    @Post('getHiringDetailsById')
    async getHiringDetailsById(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.hiringService.getHiringDetailsById(dto);
        } catch (error) {
            console.error('Error in get hiring details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching hiring details');
        }
    }

    @Post('getHiringDetails')
    async getHiringDetails(@Body() dto: CommonReq): Promise<CommonResponse> {
        try {
            return await this.hiringService.getHiringDetails(dto);
        } catch (error) {
            console.error('Error in get hiring details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching hiring details');
        }
    }

    @Post('getHiringSearchDetails')
    async getHiringSearchDetails(@Body() dto: CommonReq): Promise<CommonResponse> {
        try {
            return await this.hiringService.getHiringSearchDetails(dto);
        } catch (error) {
            console.error('Error in get hiring details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching hiring details');
        }
    }


}
