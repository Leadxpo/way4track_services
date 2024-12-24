import { DataSource, Repository } from "typeorm";
import { TicketsEntity } from "../entity/tickets.entity";
import { CommonReq } from "src/models/common-req";
export declare class TicketsRepository extends Repository<TicketsEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    totalTickets(req: CommonReq): Promise<any>;
    getTicketDetails(req: {
        ticketNumber?: string;
        branchName?: string;
        staffName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
}
