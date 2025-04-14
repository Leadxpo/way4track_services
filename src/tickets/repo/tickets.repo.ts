import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TicketsEntity } from "../entity/tickets.entity";
import { TicketsDto } from "../dto/tickets.dto";
import { CommonResponse } from "src/models/common-response";
import { ErrorResponse } from "src/models/error-response";
import { CommonReq } from "src/models/common-req";
import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";



@Injectable()

export class TicketsRepository extends Repository<TicketsEntity> {

    constructor(private dataSource: DataSource) {
        super(TicketsEntity, dataSource.createEntityManager());
    }

    async totalTickets(req: CommonReq): Promise<any> {
        const monthQuery = this.createQueryBuilder('tc')
            .select('COUNT(tc.ticket_number)', 'totalTickets')
            .where('tc.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('tc.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('DATE(tc.created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()');

        const weekQuery = this.createQueryBuilder('tc')
            .select('COUNT(tc.ticket_number)', 'totalTickets')
            .where('tc.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('tc.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('DATE(tc.created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()');

        const monthResult = await monthQuery.getRawOne();
        const weekResult = await weekQuery.getRawOne();

        const last30DaysTickets = parseInt(monthResult?.totalTickets || '0', 10);
        const last7DaysTickets = parseInt(weekResult?.totalTickets || '0', 10);

        console.log(last30DaysTickets, last7DaysTickets, ":::::::::::::");

        let percentageChange = 0;
        if (last7DaysTickets > 0) {
            percentageChange = ((last30DaysTickets - last7DaysTickets) / last7DaysTickets) * 100;
            percentageChange = Math.min(percentageChange, 100); // Ensure the percentage doesn't exceed 100%
        }

        return {
            last30DaysTickets: last30DaysTickets,
            last7DaysTickets: last7DaysTickets,
            percentageChange: percentageChange.toFixed(2),
        };
    }



    async totalTicketsBranchWise(req: CommonReq): Promise<any> {
        const query = this.createQueryBuilder('tc')
            .select([
                'COUNT(tc.ticket_number) AS totalTickets',
                'br.name as branchName',
                'SUM(CASE WHEN tc.work_status = :pending THEN 1 ELSE 0 END) AS pendingTickets',
            ])
            .leftJoin(BranchEntity, 'br', 'tc.branch_id=br.id')
            .where('tc.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('tc.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('tc.branch_id');

        const branchWiseTickets = await query.setParameter('pending', WorkStatusEnum.PENDING).getRawMany();

        // Query to get overall total tickets
        const totalQuery = this.createQueryBuilder('tc')
            .select(['COUNT(tc.ticket_number) AS totalTickets'])
            .where('tc.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('tc.unit_code = :unitCode', { unitCode: req.unitCode });

        const totalResult = await totalQuery.getRawOne();
        const totalTickets = totalResult?.totalTickets || 0;

        return {
            totalTickets, // Overall total tickets
            branchWiseTickets, // Total tickets and pending tickets per branch
        };
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

    async getTotalPendingAndSucessTickets(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        subDealerId?: string;
        date?: string;
    }) {
        const query = this.createQueryBuilder('wa')
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .leftJoin(SubDealerEntity, 'sb', 'wa.sub_dealer_id = sb.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.staffId) {
            query.andWhere('wa.staff_id = :staffId', { staffId: req.staffId });
        }

        if (req.subDealerId) {
            query.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }

        if (req.date) {
            // Only filter by date if provided
            query.andWhere('DATE_FORMAT(wa.date, "%Y-%m") = :date', { date: req.date });
        }

        query.select([
            'wa.staff_id AS staffId',
            'staff.name AS staffName',
            'sb.sub_dealer_id AS subDealerId',
            'COUNT(wa.id) AS totalTickets',
            'SUM(CASE WHEN wa.work_status = :pending THEN 1 ELSE 0 END) AS totalPendingTickets',
            'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessTickets',
            'SUM(CASE WHEN wa.work_status = :processing THEN 1 ELSE 0 END) AS totalProcessingTickets',
        ]);

        // Group by staff and subdealer to separate rows per person/sub-dealer
        query
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .addGroupBy('sb.sub_dealer_id');

        const result = await query
            .setParameter('completed', WorkStatusEnum.COMPLETED)
            .setParameter('pending', WorkStatusEnum.PENDING)
            .setParameter('processing', WorkStatusEnum.Processing)
            .getRawMany();

        return result;
    }



}