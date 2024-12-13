import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseService } from './request-raise.service';

@Controller('requests')
export class RequestRaiseController {
    constructor(private readonly requestService: RequestRaiseService) { }

    @Post('saveRequestDetails')
    async saveRequestDetails(@Body() dto: RequestRaiseDto): Promise<CommonResponse> {
        try {
            return await this.requestService.saveRequestDetails(dto);
        } catch (error) {
            console.error('Error in save request details in service:', error);
            return new CommonResponse(false, 500, 'Error saving request details');
        }
    }


    @Post('deleteRequestDetails')
    async deleteRequestDetails(@Body() dto: RequestRaiseIdDto): Promise<CommonResponse> {
        try {
            return await this.requestService.deleteRequestDetails(dto);
        } catch (error) {
            console.error('Error in delete request details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting request details');
        }
    }

    @Post('getRequestDetails')
    async getRequestDetails(@Body() dto: RequestRaiseIdDto): Promise<CommonResponse> {
        try {
            return await this.requestService.getRequestDetails(dto);

        } catch (error) {
            console.error('Error in get request details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching request details');
        }
    }

    @Post('getRequestsDropDown')
    async getRequestsDropDown(): Promise<CommonResponse> {
        try {
            return this.requestService.getRequestsDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
}
