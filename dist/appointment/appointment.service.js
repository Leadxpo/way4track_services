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
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const appointement_repo_1 = require("./repo/appointement.repo");
const appointement_adapter_1 = require("./appointement.adapter");
let AppointmentService = class AppointmentService {
    constructor(appointmentRepository, appointmentAdapter) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentAdapter = appointmentAdapter;
    }
    async updateAppointmentDetails(dto) {
        try {
            const existingAppointment = await this.appointmentRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
            });
            if (!existingAppointment) {
                return new common_response_1.CommonResponse(false, 4002, 'Appointment not found for the provided details.');
            }
            Object.assign(existingAppointment, this.appointmentAdapter.convertDtoToEntity(dto));
            await this.appointmentRepository.save(existingAppointment);
            return new common_response_1.CommonResponse(true, 65152, 'Appointment details updated successfully');
        }
        catch (error) {
            console.error(`Error updating appointment details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to update appointment details: ${error.message}`);
        }
    }
    async createAppointmentDetails(dto) {
        try {
            const entity = this.appointmentAdapter.convertDtoToEntity(dto);
            console.log(dto, "::::::::::");
            const lastAppointment = await this.appointmentRepository
                .createQueryBuilder('appointment')
                .select('appointment.appointmentId')
                .orderBy('appointment.id', 'DESC')
                .limit(1)
                .getOne();
            let nextNumber = 1;
            if (lastAppointment && lastAppointment.appointmentId) {
                const match = lastAppointment.appointmentId.match(/\d+/);
                nextNumber = match ? parseInt(match[0]) + 1 : 1;
            }
            entity.appointmentId = `A-${nextNumber.toString().padStart(5, '0')}`;
            await this.appointmentRepository.insert(entity);
            return new common_response_1.CommonResponse(true, 201, 'Appointment details created successfully');
        }
        catch (error) {
            console.error(`Error creating appointment details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to create appointment details: ${error.message}`);
        }
    }
    async handleAppointmentDetails(dto) {
        if (dto.id && dto.id !== null && dto.id !== undefined) {
            dto.id = Number(dto.id);
            return await this.updateAppointmentDetails(dto);
        }
        else {
            return await this.createAppointmentDetails(dto);
        }
    }
    async getAppointmentDetails(dto) {
        try {
            const appointments = await this.appointmentRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['voucherId', 'clientId', 'staffId', 'branchId']
            });
            if (!appointments) {
                throw new error_response_1.ErrorResponse(404, 'Appointment not found');
            }
            const result = this.appointmentAdapter.convertEntityToDto([appointments]);
            return new common_response_1.CommonResponse(true, 200, 'Details fetched successfully', result);
        }
        catch (error) {
            console.error('Error in getAppointmentDetails service:', error);
            throw new error_response_1.ErrorResponse(500, 'Error fetching appointment details');
        }
    }
    async getAllAppointmentDetails(dto) {
        try {
            const appointments = await this.appointmentRepository.find({
                where: { companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['voucherId', 'clientId', 'staffId', 'branchId']
            });
            if (!appointments) {
                throw new error_response_1.ErrorResponse(404, 'Appointment not found');
            }
            const result = this.appointmentAdapter.convertEntityToDto(appointments);
            return new common_response_1.CommonResponse(true, 200, 'Details fetched successfully', result);
        }
        catch (error) {
            console.error('Error in getAppointmentDetails service:', error);
            throw new error_response_1.ErrorResponse(500, 'Error fetching appointment details');
        }
    }
    async deleteAppointmentDetails(dto) {
        try {
            const appointmentExists = await this.appointmentRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });
            if (!appointmentExists) {
                throw new error_response_1.ErrorResponse(404, `Appointment with ID ${dto.id} does not exist`);
            }
            await this.appointmentRepository.delete(dto.id);
            return new common_response_1.CommonResponse(true, 200, 'Appointment details deleted successfully');
        }
        catch (error) {
            console.error('Error in deleteAppointmentDetails service:', error);
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appointement_repo_1.AppointmentRepository,
        appointement_adapter_1.AppointmentAdapter])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map