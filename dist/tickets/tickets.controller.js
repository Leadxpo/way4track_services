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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_dto_1 = require("./dto/tickets.dto");
const common_response_1 = require("../models/common-response");
const tickets_services_1 = require("./tickets.services");
const tickets_id_dto_1 = require("./dto/tickets-id.dto");
let TicketsController = class TicketsController {
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    async handleTicketDetails(dto) {
        try {
            return await this.ticketsService.handleTicketDetails(dto);
        }
        catch (error) {
            console.error('Error in save ticket details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving ticket details');
        }
    }
    async deleteTicketDetails(dto) {
        try {
            return await this.ticketsService.deleteTicketDetails(dto);
        }
        catch (error) {
            console.error('Error in delete ticket details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting ticket details');
        }
    }
    async getTicketDetailsById(dto) {
        try {
            return await this.ticketsService.getTicketDetailsById(dto);
        }
        catch (error) {
            console.error('Error in get ticket details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching ticket details');
        }
    }
    async getTicketDetails(req) {
        try {
            return this.ticketsService.getTicketDetails(req);
        }
        catch (error) {
            console.error('Error in delete vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)('handleTicketDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tickets_dto_1.TicketsDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "handleTicketDetails", null);
__decorate([
    (0, common_1.Post)('deleteTicketDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tickets_id_dto_1.TicketsIdDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "deleteTicketDetails", null);
__decorate([
    (0, common_1.Post)('getTicketDetailsById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tickets_id_dto_1.TicketsIdDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getTicketDetailsById", null);
__decorate([
    (0, common_1.Post)('getTicketDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getTicketDetails", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_services_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map