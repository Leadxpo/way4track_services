import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TicketsEntity } from "../entity/tickets.entity";
import { TicketsDto } from "../dto/tickets.dto";
import { CommonResponse } from "src/models/common-response";
import { ErrorResponse } from "src/models/error-response";
import { CommonReq } from "src/models/common-req";



@Injectable()

export class TicketsRepository extends Repository<TicketsEntity> {

    constructor(private dataSource: DataSource) {
        super(TicketsEntity, dataSource.createEntityManager());
    }

    async totalTickets(req: CommonReq): Promise<any> {
        const query = this.createQueryBuilder('tc')
            .select([
                'count(tc.ticket_number) AS totalTickets',
            ]);
        const monthResult = await query.andWhere(`DATE(tc.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()`)
            .where(`tc.company_code = "${req.companyCode}"`)
            .andWhere(`tc.unit_code = "${req.unitCode}"`)
            .getRawOne();
        const weekResult = await query.andWhere(`DATE(tc.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()`)
            .where(`tc.company_code = "${req.companyCode}"`)
            .andWhere(`tc.unit_code = "${req.unitCode}"`)
            .getRawOne();
        const last30DaysTickets = monthResult.totalTickets;
        const last7DaysTickets = weekResult.totalTickets;
        let percentageChange = 0;
        if (last7DaysTickets && last30DaysTickets) {
            percentageChange = ((last30DaysTickets - last7DaysTickets) / last7DaysTickets) * 100;
        }

        return {
            last30DaysTickets: last30DaysTickets,
            percentageChange: percentageChange.toFixed(2),
        }
    }

    async getTicketDetails(req: {
        ticketNumber?: string; branchName?: string; staffName?: string, companyCode?: string,
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ticket')
            .select([
                'ticket.id AS id',
                'ticket.ticket_number AS ticketNumber',
                'ticket.problem AS problem',
                'ticket.date AS date',
                'ticket.addressing_department AS addressingDepartment',
                'ticket.company_code AS companyCode',
                'ticket.unit_code AS unitCode',
                'branch.name AS branchName',
                'staff.name AS staffName',
            ])
            .leftJoin('ticket.branch', 'branch')
            .leftJoin('ticket.staff', 'staff')
            .where(`ticket.company_code = "${req.companyCode}"`)
            .andWhere(`ticket.unit_code = "${req.unitCode}"`)
        if (req.ticketNumber) {
            query.andWhere('ticket.ticket_number = :ticketNumber', { ticketNumber: req.ticketNumber });
        }

        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        if (req.staffName) {
            query.andWhere('staff.name = :staffName', { staffName: req.staffName });
        }
        const result = await query.getRawMany();
        return result;
    }
}