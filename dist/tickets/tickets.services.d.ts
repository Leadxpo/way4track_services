import { TicketsAdapter } from './tickets.adapter';
import { TicketsDto } from './dto/tickets.dto';
import { CommonResponse } from 'src/models/common-response';
import { TicketsRepository } from './repo/tickets.repo';
import { TicketsIdDto } from './dto/tickets-id.dto';
export declare class TicketsService {
    private readonly ticketsAdapter;
    private readonly ticketsRepository;
    constructor(ticketsAdapter: TicketsAdapter, ticketsRepository: TicketsRepository);
    updateTicketDetails(dto: TicketsDto): Promise<CommonResponse>;
    createTicketDetails(dto: TicketsDto): Promise<CommonResponse>;
    handleTicketDetails(dto: TicketsDto): Promise<CommonResponse>;
    deleteTicketDetails(req: TicketsIdDto): Promise<CommonResponse>;
    getTicketDetailsById(req: TicketsIdDto): Promise<CommonResponse>;
    getTicketDetails(req: {
        ticketNumber?: string;
        branchName?: string;
        staffName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
}
