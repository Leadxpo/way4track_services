import { DataSource, Repository } from "typeorm";
import { TicketsEntity } from "../entity/tickets.entity";
import { CommonReq } from "src/models/common-req";
export declare class TicketsRepository extends Repository<TicketsEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    totalTickets(req: CommonReq): Promise<any>;
    totalTicketsBranchWise(req: CommonReq): Promise<any>;
    getTicketDetails(req: {
        ticketNumber?: string;
        branchName?: string;
        staffName?: string;
        companyCode?: string;
        subDealerId?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getTotalPendingAndSucessTickets(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        subDealerId?: string;
        date?: string;
    }): Promise<any[]>;
}
