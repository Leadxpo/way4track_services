"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsAdapter = void 0;
const common_1 = require("@nestjs/common");
const tickets_entity_1 = require("./entity/tickets.entity");
const staff_entity_1 = require("../staff/entity/staff.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
const get_tickets_res_dto_1 = require("./dto/get-tickets-res.dto");
let TicketsAdapter = class TicketsAdapter {
    convertDtoToEntity(dto) {
        const entity = new tickets_entity_1.TicketsEntity();
        entity.problem = dto.problem;
        entity.date = dto.date;
        entity.addressingDepartment = dto.addressingDepartment;
        const staff = new staff_entity_1.StaffEntity();
        staff.id = dto.staffId;
        entity.staff = staff;
        const branch = new branch_entity_1.BranchEntity();
        branch.id = dto.branchId;
        entity.branch = branch;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        return entity;
    }
    convertEntityToDto(entities) {
        return entities.map((entity) => {
            return new get_tickets_res_dto_1.GetTicketsResDto(entity.staff?.id || 0, entity.staff?.name || '', entity.staff?.phoneNumber || '', entity.problem, entity.date, entity.branch?.id || 0, entity.branch?.branchName || '', entity.ticketNumber, entity.addressingDepartment, entity.companyCode, entity.unitCode);
        });
    }
};
exports.TicketsAdapter = TicketsAdapter;
exports.TicketsAdapter = TicketsAdapter = __decorate([
    (0, common_1.Injectable)()
], TicketsAdapter);
//# sourceMappingURL=tickets.adapter.js.map