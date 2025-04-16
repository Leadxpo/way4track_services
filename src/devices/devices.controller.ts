




import { Controller, Post, Body } from '@nestjs/common';

import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { DeviceService } from './devices.service';
import { DeviceDto } from './dto/devices.dto';

@Controller('device')
export class DeviceController {
    constructor(private readonly service: DeviceService) { }

    @Post('handleDeviceDetails')
    async handleDeviceDetails(@Body() dto: DeviceDto): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleDeviceDetails(dto);
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



