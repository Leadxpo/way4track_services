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
exports.TicketsDashboardService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const tickets_repo_1 = require("../tickets/repo/tickets.repo");
let TicketsDashboardService = class TicketsDashboardService {
    constructor(ticketsRepositort) {
        this.ticketsRepositort = ticketsRepositort;
    }
    async totalTickets(req) {
        const data = await this.ticketsRepositort.totalTickets(req);
        if (!data) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", data);
        }
    }
    async totalTicketsBranchWise(req) {
        const data = await this.ticketsRepositort.totalTicketsBranchWise(req);
        if (!data) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", data);
        }
    }
    async getTicketDetailsAgainstSearch(req) {
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
                ? new common_response_1.CommonResponse(true, 65152, 'Ticket details retrieved successfully', tickets)
                : new common_response_1.CommonResponse(false, 404, 'No tickets found for the given criteria');
        }
        catch (error) {
            console.error(`Error fetching ticket details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to fetch ticket details: ${error.message}`);
        }
    }
};
exports.TicketsDashboardService = TicketsDashboardService;
exports.TicketsDashboardService = TicketsDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tickets_repo_1.TicketsRepository])
], TicketsDashboardService);
//# sourceMappingURL=tickets-dashboard.service.js.map