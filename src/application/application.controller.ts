import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ApplicationService } from './application.service';
import { ApplicationDto } from './dto/application.dto';

const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};

@Controller('application')
export class ApplicationController {
    constructor(private readonly service: ApplicationService) { }

    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @Post('handleApplicationDetails')
    async handleApplicationDetails(
        @Body() dto: ApplicationDto,
        @UploadedFile() photo?: Express.Multer.File,
    ): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleApplicationDetails(dto, photo);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error saving Application details');
        }
    }

    @Post('deleteApplicationDetails')
    async deleteApplicationDetails(
        @Body() dto: HiringIdDto,
    ): Promise<CommonResponse> {
        try {
            return await this.service.deleteApplicationDetails(dto);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error deleting Application');
        }
    }

    @Post('getApplicationDetails')
    async getApplicationDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.service.getApplicationDetails(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Application details');
        }
    }

    @Post('getApplicationDetailsById')
    async getApplicationDetailsById(
        @Body() req: HiringIdDto,
    ): Promise<CommonResponse> {
        try {
            return await this.service.getApplicationDetailsById(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Application by ID');
        }
    }

    @Post('getApplicationDropdown')
    async getApplicationDropdown(): Promise<CommonResponse> {
        try {
            return await this.service.getApplicationDropdown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching dropdown');
        }
    }
}
