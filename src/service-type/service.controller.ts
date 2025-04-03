import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import * as multer from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { ServiceTypeService } from './service.service';
import { ServiceTypeDto } from './dto/service.dto';

@Controller('ServiceType')
export class ServiceTypeController {
    constructor(private readonly service: ServiceTypeService) { }

    @Post('handleServiceTypeDetails')

    async handleServiceTypeDetails(
        @Body() dto: ServiceTypeDto,
    ): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.service.handleServiceTypeDetails(dto);
        } catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }

    @Post('deleteServiceTypeDetails')
    async deleteServiceTypeDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteServiceTypeDetails(dto);
        } catch (error) {
            console.error('Error in delete client details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting client details');
        }
    }

    @Post('getServiceTypeDetails')
    async getServiceTypeDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.service.getServiceTypeDetails(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getServiceTypeDetailsById')
    async getServiceTypeDetailsById(@Body() req: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getServiceTypeDetailsById(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getServiceTypeNamesDropDown')
    async getServiceTypeNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.service.getServiceTypeNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

}
