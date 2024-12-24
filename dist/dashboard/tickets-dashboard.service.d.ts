import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { TicketsSearchDto } from "src/tickets/dto/ticket-search.dto";
import { TicketsRepository } from "src/tickets/repo/tickets.repo";
export declare class TicketsDashboardService {
    private ticketsRepositort;
    constructor(ticketsRepositort: TicketsRepository);
    totalTickets(req: CommonReq): Promise<CommonResponse>;
    getTicketDetailsAgainstSearch(req: TicketsSearchDto): Promise<any>;
}
