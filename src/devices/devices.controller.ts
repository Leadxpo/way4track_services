
import { Controller, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';

import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { DeviceService } from './devices.service';
import { DeviceDto } from './dto/devices.dto';
import * as multer from 'multer';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('device')
export class DeviceController {
    constructor(private readonly service: DeviceService) { }
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mediaFiles', maxCount: 10 },
        { name: 'pointFiles', maxCount: 10 },
    ]))
    @Post('handleDeviceDetails')
    async handleDeviceDetails(
        @Body() dto: any,
        @UploadedFiles() files: {
            mediaFiles?: Express.Multer.File[],
            pointFiles?: Express.Multer.File[]
        }
    ): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            if (dto.isRelay) dto.isRelay = Boolean(dto.isRelay);
            if (dto.relayAmt) dto.relayAmt = Number(dto.relayAmt);
            if (dto.isSubscription) dto.isSubscription = Boolean(dto.isSubscription);
            if (dto.subscriptionMonthlyAmt) dto.subscriptionMonthlyAmt = Number(dto.subscriptionMonthlyAmt);
            if (dto.subscriptionYearlyAmt) dto.subscriptionYearlyAmt = Number(dto.subscriptionYearlyAmt);
            if (dto.network2gAmt) dto.network2gAmt = Number(dto.network2gAmt);
            if (dto.network4gAmt) dto.network4gAmt = Number(dto.network4gAmt);
            if (dto.isNetwork) dto.isNetwork = Boolean(dto.isNetwork);
            if (dto.amount) dto.amount = Number(dto.amount);
            const points = [];
            let i = 0;
            while (dto[`points[${i}].title`] || dto[`points[${i}].desc`] || dto[`points[${i}].dest`]) {
                points.push({
                    title: dto[`points[${i}].title`] || '',
                    desc: dto[`points[${i}].desc`] || dto[`points[${i}].dest`] || '',
                    file: '' // Will be set after upload
                });
                i++;
            }
            dto.points = points;
            const mediaFiles = files?.mediaFiles || [];
            const pointFiles = files?.pointFiles || [];
            return await this.service.handleDeviceDetails(dto, mediaFiles, pointFiles);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error saving Device details');
        }
    }

    @Post('deleteDeviceDetails')
    async deleteDeviceDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteDeviceDetails(dto);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error deleting Device');
        }
    }

    @Post('getDeviceDetails')
    async getDeviceDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.service.getDeviceDetails(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Device details');
        }
    }

    @Post('getDeviceDetailsById')
    async getDeviceDetailsById(@Body() req: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getDeviceDetailsById(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Device by ID');
        }
    }

    @Post('getDeviceDropdown')
    async getDeviceDropdown(): Promise<CommonResponse> {
        try {
            return await this.service.getDeviceDropdown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching dropdown');
        }
    }
}



