"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionAdapter = void 0;
const common_1 = require("@nestjs/common");
const permissions_entity_1 = require("./entity/permissions.entity");
const staff_entity_1 = require("../staff/entity/staff.entity");
const sub_dealer_entity_1 = require("../sub-dealer/entity/sub-dealer.entity");
let PermissionAdapter = class PermissionAdapter {
    convertPermissionDtoToEntity(dto) {
        const entity = new permissions_entity_1.PermissionEntity();
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.permissions = dto.permissions;
        const sub = new sub_dealer_entity_1.SubDealerEntity();
        sub.id = dto.subDealerId;
        entity.subDealerId = sub;
        const staff = new staff_entity_1.StaffEntity();
        staff.staffId = dto.staffId;
        entity.staffId = staff;
        entity.startDate = dto.startDate;
        entity.endDate = dto.endDate;
        if (entity.id) {
            entity.id = dto.id;
        }
        entity.staffStatus = dto.staffStatus;
        return entity;
    }
};
exports.PermissionAdapter = PermissionAdapter;
exports.PermissionAdapter = PermissionAdapter = __decorate([
    (0, common_1.Injectable)()
], PermissionAdapter);
//# sourceMappingURL=permissions.adapter.js.map