"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentAdapter = void 0;
const common_1 = require("@nestjs/common");
const appointement_entity_1 = require("./entity/appointement.entity");
const staff_entity_1 = require("../staff/entity/staff.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
const client_entity_1 = require("../client/entity/client.entity");
const appointment_res_sto_1 = require("./dto/appointment-res.sto");
const voucher_entity_1 = require("../voucher/entity/voucher.entity");
let AppointmentAdapter = class AppointmentAdapter {
    convertDtoToEntity(dto) {
        const entity = new appointement_entity_1.AppointmentEntity();
        entity.appointmentType = dto.appointmentType;
        entity.name = dto.name;
        entity.date = dto.date;
        entity.slot = dto.slot + ':00';
        entity.period = dto.period;
        entity.description = dto.description;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        const staff = new staff_entity_1.StaffEntity();
        staff.id = dto.assignedTo;
        entity.staffId = staff;
        if (dto.voucherId) {
            const voucher = new voucher_entity_1.VoucherEntity();
            voucher.id = dto.voucherId;
            entity.voucherId = voucher;
        }
        else {
            entity.voucherId = null;
        }
        const branch = new branch_entity_1.BranchEntity();
        branch.id = dto.branchId;
        entity.branchId = branch;
        const client = new client_entity_1.ClientEntity();
        client.id = dto.clientId;
        entity.clientId = client;
        entity.appointmentId = dto.appointmentId;
        return entity;
    }
    convertEntityToDto(entities) {
        return entities.map((entity) => {
            const formattedDate = new Date(entity.date).toLocaleDateString('en-GB');
            const formattedTime = entity.slot.substring(0, 5);
            return new appointment_res_sto_1.AppointmentResDto(entity.id, entity.name, entity.clientId?.phoneNumber || '', entity.clientId?.clientId || null, entity.clientId?.address || '', entity.clientId?.name || '', entity.branchId?.id || 0, entity.branchId?.branchName || '', entity.appointmentType, entity.staffId?.id || 0, entity.staffId?.name || '', formattedDate, formattedTime, entity.period, entity.description, entity.status, entity.appointmentId, entity.companyCode, entity.unitCode, entity.voucherId ? entity.voucherId.voucherId : '');
        });
    }
};
exports.AppointmentAdapter = AppointmentAdapter;
exports.AppointmentAdapter = AppointmentAdapter = __decorate([
    (0, common_1.Injectable)()
], AppointmentAdapter);
//# sourceMappingURL=appointement.adapter.js.map