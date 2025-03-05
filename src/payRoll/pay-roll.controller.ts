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
}
