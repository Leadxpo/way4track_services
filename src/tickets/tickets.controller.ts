import { Controller, Post, Body } from '@nestjs/common';
import { TicketsDto } from './dto/tickets.dto';
import { CommonResponse } from 'src/models/common-response';
import { TicketsService } from './tickets.services';
import { TicketsIdDto } from './dto/tickets-id.dto';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post('saveTicketDetails')
    async saveTicketDetails(@Body() dto: TicketsDto): Promise<CommonResponse> {
        try {
            return await this.ticketsService.saveTicketDetails(dto);
        } catch (error) {
            console.error('Error in save ticket details in service:', error);
            return new CommonResponse(false, 500, 'Error saving ticket details');
        }
    }

    @Post('deleteTicketDetails')
    async deleteTicketDetails(@Body() dto: TicketsIdDto): Promise<CommonResponse> {
        try {
            return await this.ticketsService.deleteTicketDetails(dto);
        } catch (error) {
            console.error('Error in delete ticket details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting ticket details');
        }
    }

    @Post('getTicketDetails')
    async getTicketDetails(@Body() dto: TicketsIdDto): Promise<CommonResponse> {
        try {
            return await this.ticketsService.getTicketDetails(dto);
        } catch (error) {
            console.error('Error in get ticket details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching ticket details');
        }
    }
}
