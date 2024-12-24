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
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const appointment_service_1 = require("./appointment.service");
const common_response_1 = require("../models/common-response");
const appointment_id_dto_1 = require("./dto/appointment-id.dto");
const appointement_dto_1 = require("./dto/appointement.dto");
let AppointmentController = class AppointmentController {
    constructor(appointmentService) {
        this.appointmentService = appointmentService;
    }
    async handleAppointmentDetails(dto) {
        try {
            return await this.appointmentService.handleAppointmentDetails(dto);
        }
        catch (error) {
            console.error('Error in save appointment details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving appointment details');
        }
    }
    async deleteAppointmentDetails(dto) {
        try {
            return await this.appointmentService.deleteAppointmentDetails(dto);
        }
        catch (error) {
            console.error('Error in delete appointment details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting appointment details');
        }
    }
    async getAppointmentDetails(dto) {
        try {
            return await this.appointmentService.getAppointmentDetails(dto);
        }
        catch (error) {
            console.error('Error in get appointment details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching appointment details');
        }
    }
};
exports.AppointmentController = AppointmentController;
__decorate([
    (0, common_1.Post)('handleAppointmentDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointement_dto_1.AppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "handleAppointmentDetails", null);
__decorate([
    (0, common_1.Post)('deleteAppointmentDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_id_dto_1.AppointmentIdDto]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "deleteAppointmentDetails", null);
__decorate([
    (0, common_1.Post)('getAppointmentDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_id_dto_1.AppointmentIdDto]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentDetails", null);
exports.AppointmentController = AppointmentController = __decorate([
    (0, common_1.Controller)('appointment'),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentService])
], AppointmentController);
//# sourceMappingURL=appointment.controller.js.map