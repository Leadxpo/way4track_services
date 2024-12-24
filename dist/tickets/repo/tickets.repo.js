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
let TicketsRepository = class TicketsRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(tickets_entity_1.TicketsEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async totalTickets(req) {
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
        ])
            .leftJoin('ticket.branch', 'branch')
            .leftJoin('ticket.staff', 'staff')
            .where(`ticket.company_code = "${req.companyCode}"`)
            .andWhere(`ticket.unit_code = "${req.unitCode}"`);
        if (req.ticketNumber) {
            query.andWhere('ticket.ticket_number = :ticketNumber', { ticketNumber: req.ticketNumber });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }
        if (req.staffName) {
            query.andWhere('staff.name = :staffName', { staffName: req.staffName });
        }
        console.log(query, "{{{{{{{{{{{{{{{{{{{");
        const result = await query.getRawMany();
        return result;
    }
};
exports.TicketsRepository = TicketsRepository;
exports.TicketsRepository = TicketsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TicketsRepository);
//# sourceMappingURL=tickets.repo.js.map