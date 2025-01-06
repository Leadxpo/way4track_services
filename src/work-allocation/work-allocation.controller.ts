import { Controller, Post, Body, Get, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { WorkAllocationService } from './work-allocation.service';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { WorkAllocationEntity } from './entity/work-allocation.entity';

@Controller('work-allocations')
export class WorkAllocationController {
    constructor(private readonly workAllocationService: WorkAllocationService) { }

    @Post('handleWorkAllocationDetails')
    async handleWorkAllocationDetails(@Body() dto: WorkAllocationDto) {
        try {
            return this.workAllocationService.handleWorkAllocationDetails(dto);

        } catch (error) {
            console.error('Error in save vendor details:', error);
            return new CommonResponse(false, 500, 'Error saving vendor details');
        }
    }

    @Post('getWorkAllocationDetails')
    async getWorkAllocationDetails(@Body() dto: WorkAllocationIdDto) {
        try {
            return this.workAllocationService.getWorkAllocationDetails(dto);
        } catch (error) {
            console.error('Error in get vendor details:', error);
            return new CommonResponse(false, 500, 'Error fetching vendor details');
        }
    }

    @Post('deleteWorkAllocation')
    async deleteWorkAllocation(@Body() dto: WorkAllocationIdDto) {
        try {
            return this.workAllocationService.deleteWorkAllocation(dto);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getWorkAllocation')
    async getWorkAllocation(@Body() req: {
        workAllocationNumber?: string; serviceOrProduct?: string; clientName?: string, companyCode?: string;
        unitCode?: string
    }) {
        try {
            return this.workAllocationService.getWorkAllocation(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('markInstall')
    async markInstall(@Body() productId: number, companyCode: string, unitCode: string): Promise<WorkAllocationEntity> {
        try {
            return await this.workAllocationService.markInstall(productId, companyCode, unitCode);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }
}
