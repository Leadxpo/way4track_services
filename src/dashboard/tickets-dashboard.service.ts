
import { Injectable } from "@nestjs/common";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { ErrorResponse } from "src/models/error-response";
import { TicketsSearchDto } from "src/tickets/dto/ticket-search.dto";
import { TicketsDto } from "src/tickets/dto/tickets.dto";
import { TicketsRepository } from "src/tickets/repo/tickets.repo";

@Injectable()
export class TicketsDashboardService {

    constructor(
        private ticketsRepositort: TicketsRepository,
    ) { }
    async totalTickets(req: CommonReq): Promise<CommonResponse> {
        const data = await this.ticketsRepositort.totalTickets(req)
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }

    async totalTicketsBranchWise(req: CommonReq): Promise<CommonResponse> {
        const data = await this.ticketsRepositort.totalTicketsBranchWise(req)
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }

    async getTicketDetailsAgainstSearch(req: TicketsSearchDto): Promise<any> {
        try {
            const queryBuilder = this.ticketsRepositort.createQueryBuilder('ticket')
                .select([
                    'ticket.id as ticketId',
                    'ticket.ticket_number as ticketNumber',
                    'staff.name AS staffName',
                    'ticket.addressing_department as addressingDepartment',
                    'branch.name AS branchName',
                    'ticket.date as date',
                ])
                .leftJoin('ticket.staff', 'staff')
                .leftJoin('ticket.branch', 'branch')
                .where('ticket.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('ticket.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.staffId) {
                queryBuilder.andWhere('staff.id = :staffId', { staffId: req.staffId });
            }

            if (req.branchName) {
                queryBuilder.andWhere('branch.name LIKE :branchName', { branchName: `%${req.branchName}%` });
            }

            if (req.ticketId) {
                queryBuilder.andWhere('ticket.id = :ticketId', { ticketId: req.ticketId });
            }

            const tickets = await queryBuilder.getRawMany();

            return tickets.length > 0
                ? new CommonResponse(true, 65152, 'Ticket details retrieved successfully', tickets)
                : new CommonResponse(false, 404, 'No tickets found for the given criteria');
        } catch (error) {
            console.error(`Error fetching ticket details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to fetch ticket details: ${error.message}`);
        }
    }
}