"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkAllocationAdapter = void 0;
const common_1 = require("@nestjs/common");
const work_allocation_entity_1 = require("./entity/work-allocation.entity");
const work_allocation_res_dto_1 = require("./dto/work-allocation-res.dto");
const client_entity_1 = require("../client/entity/client.entity");
const staff_entity_1 = require("../staff/entity/staff.entity");
let WorkAllocationAdapter = class WorkAllocationAdapter {
    convertDtoToEntity(dto) {
        const entity = new work_allocation_entity_1.WorkAllocationEntity();
        if (dto.id)
            entity.id = dto.id;
        const client = new client_entity_1.ClientEntity();
        client.id = dto.clientId;
        entity.clientId = client;
        const staff = new staff_entity_1.StaffEntity();
        staff.id = dto.staffId;
        entity.staffId = staff;
        entity.serviceOrProduct = dto.serviceOrProduct;
        entity.otherInformation = dto.otherInformation;
        entity.date = dto.date;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        return entity;
    }
    convertEntityToDto(entities) {
        return entities.map((entity) => {
            const client = entity.clientId;
            const staff = entity.staffId;
            return new work_allocation_res_dto_1.WorkAllocationResDto(entity.id, entity.workAllocationNumber, entity.serviceOrProduct, entity.otherInformation, entity.date, client?.id || 0, client?.name || '', client?.address || '', client?.phoneNumber || '', staff?.id || 0, entity?.staffId?.name || '', entity.companyCode, entity.unitCode);
        });
    }
};
exports.WorkAllocationAdapter = WorkAllocationAdapter;
exports.WorkAllocationAdapter = WorkAllocationAdapter = __decorate([
    (0, common_1.Injectable)()
], WorkAllocationAdapter);
//# sourceMappingURL=work-allocation.adapter.js.map