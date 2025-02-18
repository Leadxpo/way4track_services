import { Controller, Post, Body } from '@nestjs/common';
import { TicketsDto } from './dto/tickets.dto';
import { CommonResponse } from 'src/models/common-response';
import { TicketsService } from './tickets.services';
import { TicketsIdDto } from './dto/tickets-id.dto';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post('handleTicketDetails')
    async handleTicketDetails(@Body() dto: TicketsDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.ticketsService.handleTicketDetails(dto);
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

    @Post('getTotalPendingAndSucessTickets')
    async getTotalPendingAndSucessTickets(@Body() req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
        date: string
    }) {
        try {
            return this.ticketsService.getTotalPendingAndSucessTickets(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getTicketDetailsById')
    async getTicketDetailsById(@Body() dto: TicketsIdDto): Promise<CommonResponse> {
        try {
            return await this.ticketsService.getTicketDetailsById(dto);
        } catch (error) {
            console.error('Error in get ticket details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching ticket details');
        }
    }

    @Post('getTicketDetails')
    async getTicketDetails(@Body() req: {
        ticketNumber?: string; branchName?: string; staffName?: string, companyCode?: string,
        unitCode?: string
    }) {
        try {
            return this.ticketsService.getTicketDetails(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
}
