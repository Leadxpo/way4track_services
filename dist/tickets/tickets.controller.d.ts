import { TicketsDto } from './dto/tickets.dto';
import { CommonResponse } from 'src/models/common-response';
import { TicketsService } from './tickets.services';
import { TicketsIdDto } from './dto/tickets-id.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    handleTicketDetails(dto: TicketsDto): Promise<CommonResponse>;
    deleteTicketDetails(dto: TicketsIdDto): Promise<CommonResponse>;
    getTicketDetailsById(dto: TicketsIdDto): Promise<CommonResponse>;
    getTicketDetails(req: {
        ticketNumber?: string;
        branchName?: string;
        staffName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
}
