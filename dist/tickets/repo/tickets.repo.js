"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const tickets_entity_1 = require("../entity/tickets.entity");
const work_status_enum_1 = require("../../work-allocation/enum/work-status-enum");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
let TicketsRepository = class TicketsRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(tickets_entity_1.TicketsEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async totalTickets(req) {
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
            percentageChange = Math.min(percentageChange, 100);
        }
        return {
            last30DaysTickets: last30DaysTickets,
            last7DaysTickets: last7DaysTickets,
            percentageChange: percentageChange.toFixed(2),
        };
    }
    async totalTicketsBranchWise(req) {
        const pendingStatus = work_status_enum_1.WorkStatusEnum.PENDING;
        const branchQuery = this.createQueryBuilder('tc')
            .select([
            'COUNT(tc.ticket_number) AS totalTickets',
            'br.name AS branchName',
            'SUM(CASE WHEN tc.work_status = :pending THEN 1 ELSE 0 END) AS pendingTickets',
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'tc.branch_id = br.id')
            .where('tc.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('tc.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('tc.branch_id');
        const branchWiseTickets = await branchQuery
            .setParameter('pending', pendingStatus)
            .getRawMany();
        const subDealerQuery = this.createQueryBuilder('tc')
            .select([
            'COUNT(tc.ticket_number) AS totalTickets',
            'sb.sub_dealer_id AS subDealerId',
            'sb.name AS subDealerName',
            'SUM(CASE WHEN tc.work_status = :pending THEN 1 ELSE 0 END) AS pendingTickets',
        ])
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'tc.sub_dealer_id = sb.id')
            .where('tc.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('tc.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('tc.sub_dealer_id');
        const subDealerWiseTickets = await subDealerQuery
            .setParameter('pending', pendingStatus)
            .getRawMany();
        const totalQuery = this.createQueryBuilder('tc')
            .select(['COUNT(tc.ticket_number) AS totalTickets'])
            .where('tc.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('tc.unit_code = :unitCode', { unitCode: req.unitCode });
        const totalResult = await totalQuery.getRawOne();
        const totalTickets = totalResult?.totalTickets || 0;
        return {
            totalTickets,
            branchWiseTickets,
            subDealerWiseTickets,
        };
    }
    async getTicketDetails(req) {
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
            'sb.sub_dealer_id AS subDealerId',
            'sb.name AS subDealerName',
        ])
            .leftJoin('ticket.branch', 'branch')
            .leftJoin('ticket.staff', 'staff')
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'ticket.sub_dealer_id = sb.id')
            .where('ticket.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ticket.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.ticketNumber) {
            query.andWhere('ticket.ticket_number = :ticketNumber', { ticketNumber: req.ticketNumber });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }
        if (req.staffName) {
            query.andWhere('staff.name = :staffName', { staffName: req.staffName });
        }
        if (req.subDealerId) {
            query.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }
        const result = await query.getRawMany();
        return result;
    }
    async getTotalPendingAndSucessTickets(req) {
        const query = this.createQueryBuilder('wa')
            .leftJoin(staff_entity_1.StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'wa.sub_dealer_id = sb.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.staffId) {
            query.andWhere('wa.staff_id = :staffId', { staffId: req.staffId });
        }
        if (req.subDealerId) {
            query.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }
        if (req.date) {
            query.andWhere('DATE_FORMAT(wa.date, "%Y-%m") = :date', { date: req.date });
        }
        query.select([
            'wa.staff_id AS staffId',
            'staff.name AS staffName',
            'sb.sub_dealer_id AS subDealerId',
            'sb.name AS subDealerName',
            'COUNT(wa.id) AS totalTickets',
            'SUM(CASE WHEN wa.work_status = :pending THEN 1 ELSE 0 END) AS totalPendingTickets',
            'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessTickets',
            'SUM(CASE WHEN wa.work_status = :processing THEN 1 ELSE 0 END) AS totalProcessingTickets',
        ]);
        query
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .addGroupBy('sb.sub_dealer_id')
            .addGroupBy('sb.name');
        const result = await query
            .setParameter('completed', work_status_enum_1.WorkStatusEnum.COMPLETED)
            .setParameter('pending', work_status_enum_1.WorkStatusEnum.PENDING)
            .setParameter('processing', work_status_enum_1.WorkStatusEnum.Processing)
            .getRawMany();
        return result;
    }
};
exports.TicketsRepository = TicketsRepository;
exports.TicketsRepository = TicketsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TicketsRepository);
//# sourceMappingURL=tickets.repo.js.map