import { Controller, Post, Body } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { PayrollService } from './pay-roll.service';
import { PayrollDto } from './dto/payroll.dto';


@Controller('PAYROLL')
export class PayRollController {
    constructor(private readonly ticketsService: PayrollService) { }

    @Post('createOrUpdatePayroll')
    async createOrUpdatePayroll(@Body() dto: PayrollDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.ticketsService.createOrUpdatePayroll([dto]);
        } catch (error) {
            console.error('Error in save ticket details in service:', error);
            return new CommonResponse(false, 500, 'Error saving ticket details');
        }
    }

    @Post('getPayRollStaffDetails')
    async getPayRollStaffDetails(@Body() req: { staffId: string; month: string; year: string }): Promise<CommonResponse> {
        try {
            return this.ticketsService.getPayRollStaffDetails(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getPayDateRangeRoll')
    async getPayDateRangeRoll(@Body() req: { staffId: string; fromDate: Date; toDate: Date }): Promise<CommonResponse> {
        try {
            return this.ticketsService.getPayDateRangeRoll(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getPayRollDetails')
    async getPayRollDetails(@Body() req: { month: string; year: string }): Promise<CommonResponse> {
        try {
            return this.ticketsService.getPayRollDetails(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
}
