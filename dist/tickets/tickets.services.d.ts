import { TicketsAdapter } from './tickets.adapter';
import { TicketsDto } from './dto/tickets.dto';
import { CommonResponse } from 'src/models/common-response';
import { TicketsRepository } from './repo/tickets.repo';
import { TicketsIdDto } from './dto/tickets-id.dto';
import { NotificationService } from 'src/notifications/notification.service';
export declare class TicketsService {
    private readonly ticketsAdapter;
    private readonly ticketsRepository;
    private readonly notificationService;
    constructor(ticketsAdapter: TicketsAdapter, ticketsRepository: TicketsRepository, notificationService: NotificationService);
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
        subDealerId?: string;
    }): Promise<CommonResponse>;
    getTotalPendingAndSucessTickets(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        date: string;
        subDealerId?: string;
    }): Promise<CommonResponse>;
}
