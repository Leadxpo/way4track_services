"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRaiseAdapter = void 0;
const common_1 = require("@nestjs/common");
const request_res_dto_1 = require("./dto/request-res.dto");
const request_raise_entity_1 = require("./entity/request-raise.entity");
const staff_entity_1 = require("../staff/entity/staff.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
const client_entity_1 = require("../client/entity/client.entity");
let RequestRaiseAdapter = class RequestRaiseAdapter {
    convertDtoToEntity(dto) {
        const entity = new request_raise_entity_1.RequestRaiseEntity();
        entity.requestType = dto.requestType;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        const staff = new staff_entity_1.StaffEntity();
        staff.id = dto.staffID;
        entity.staffId = staff;
        const branch = new branch_entity_1.BranchEntity();
        branch.id = dto.branchId;
        entity.branchId = branch;
        const client = new client_entity_1.ClientEntity();
        client.id = dto.clientID;
        entity.clientID = client;
        entity.description = dto.description;
        entity.createdDate = dto.createdDate;
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
    convertEntityToResDto(entity) {
        const { staffId, branchId, clientID, ...rest } = entity;
        return new request_res_dto_1.RequestResDto(entity.id, entity.requestType, staffId.id, clientID.name, staffId.name, entity.description, entity.createdDate, branchId.id, branchId.branchName, entity.status, entity.companyCode, entity.unitCode);
    }
};
exports.RequestRaiseAdapter = RequestRaiseAdapter;
exports.RequestRaiseAdapter = RequestRaiseAdapter = __decorate([
    (0, common_1.Injectable)()
], RequestRaiseAdapter);
//# sourceMappingURL=request-raise.adapter.js.map