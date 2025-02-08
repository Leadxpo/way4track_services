import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseService } from './request-raise.service';
import { CommonReq } from 'src/models/common-req';

@Controller('requests')
export class RequestRaiseController {
    constructor(private readonly requestService: RequestRaiseService) { }

    @Post('handleRequestDetails')
    async handleRequestDetails(@Body() dto: RequestRaiseDto): Promise<CommonResponse> {
        try {
            return await this.requestService.handleRequestDetails(dto);
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

    @Post('getAllRequestDetails')
    async getAllRequestDetails(@Body() dto: CommonReq): Promise<CommonResponse> {
        try {
            return await this.requestService.getAllRequestDetails(dto);

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

    @Post('getRequestsBySearch')
    async getRequests(@Body() req: {
        fromDate?: Date; toDate?: Date; status?: string, companyCode?: string,
        unitCode?: string
    }) {
        try {
            return this.requestService.getRequests(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getTodayRequestBranchWise')
    async getTodayRequestBranchWise(@Body() req: { companyCode: string, unitCode: string, branch?: string }) {
        try {
            return await this.requestService.getTodayRequestBranchWise(req);
        } catch (error) {
            console.error('Error in getTodayRequestBranchWise:', error);
            return new CommonResponse(false, 500, "Error fetching today's requests");
        }
    }
    
}
