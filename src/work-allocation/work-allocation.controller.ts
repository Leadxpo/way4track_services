import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { WorkAllocationService } from './work-allocation.service';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';
import { CommonResponse } from 'src/models/common-response';

@Controller('work-allocations')
export class WorkAllocationController {
    constructor(private readonly workAllocationService: WorkAllocationService) { }

    @Post('saveWorkAllocation')
    async saveWorkAllocation(@Body() dto: WorkAllocationDto) {
        try {
            return this.workAllocationService.saveWorkAllocationDetails(dto);

        } catch (error) {
            console.error('Error in save vendor details:', error);
            return new CommonResponse(false, 500, 'Error saving vendor details');
        }
    }

    @Post('getWorkAllocation')
    async getWorkAllocation(@Body() dto: WorkAllocationIdDto) {
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
}
