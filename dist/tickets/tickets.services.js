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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const tickets_adapter_1 = require("./tickets.adapter");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const tickets_repo_1 = require("./repo/tickets.repo");
let TicketsService = class TicketsService {
    constructor(ticketsAdapter, ticketsRepository) {
        this.ticketsAdapter = ticketsAdapter;
        this.ticketsRepository = ticketsRepository;
    }
    async updateTicketDetails(dto) {
        try {
            const existingTicket = await this.ticketsRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });
            if (!existingTicket) {
                return new common_response_1.CommonResponse(false, 4002, 'Ticket not found for the provided ID.');
            }
            Object.assign(existingTicket, this.ticketsAdapter.convertDtoToEntity(dto));
            await this.ticketsRepository.save(existingTicket);
            return new common_response_1.CommonResponse(true, 200, 'Ticket details updated successfully', existingTicket.ticketNumber);
        }
        catch (error) {
            console.error(`Error updating ticket details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to update ticket details: ${error.message}`);
        }
    }
    async createTicketDetails(dto) {
        try {
            const newTicket = this.ticketsAdapter.convertDtoToEntity(dto);
            const count = await this.ticketsRepository.count();
            newTicket.ticketNumber = `Tickets-${(count + 1).toString().padStart(5, '0')}`;
            await this.ticketsRepository.save(newTicket);
            return new common_response_1.CommonResponse(true, 201, 'Ticket details created successfully', newTicket.ticketNumber);
        }
        catch (error) {
            console.error(`Error creating ticket details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to create ticket details: ${error.message}`);
        }
    }
    async handleTicketDetails(dto) {
        if (dto.id) {
            return await this.updateTicketDetails(dto);
        }
        else {
            return await this.createTicketDetails(dto);
        }
    }
    async deleteTicketDetails(req) {
        try {
            const ticket = await this.ticketsRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!ticket) {
                return new common_response_1.CommonResponse(false, 404, 'Ticket not found');
            }
            await this.ticketsRepository.delete(ticket.id);
            return new common_response_1.CommonResponse(true, 200, 'Ticket details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getTicketDetailsById(req) {
        try {
            const ticket = await this.ticketsRepository.find({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['staff', 'branch'] });
            if (!ticket) {
                return new common_response_1.CommonResponse(false, 404, 'Ticket not found');
            }
            const dto = this.ticketsAdapter.convertEntityToDto(ticket);
            return new common_response_1.CommonResponse(true, 200, 'Ticket details fetched successfully', dto);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getTicketDetails(req) {
        const VoucherData = await this.ticketsRepository.getTicketDetails(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tickets_adapter_1.TicketsAdapter,
        tickets_repo_1.TicketsRepository])
], TicketsService);
//# sourceMappingURL=tickets.services.js.map