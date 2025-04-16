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
exports.Permission = exports.PermissionEntity = void 0;
const typeorm_1 = require("typeorm");
const role_enum_1 = require("../dto/role.enum");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const staff_status_1 = require("../../staff/enum/staff-status");
let PermissionEntity = class PermissionEntity {
};
exports.PermissionEntity = PermissionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PermissionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        name: 'permissions',
        nullable: true,
        comment: 'Array of permissions with add, edit, view, and delete flags',
    }),
    __metadata("design:type", Array)
], PermissionEntity.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'role',
        type: 'enum',
        enum: role_enum_1.Roles
    }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.permissions),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], PermissionEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sub_dealer_entity_1.SubDealerEntity, (SubDealerEntity) => SubDealerEntity.permissions),
    (0, typeorm_1.JoinColumn)({ name: 'sub_dealer_id' }),
    __metadata("design:type", sub_dealer_entity_1.SubDealerEntity)
], PermissionEntity.prototype, "subDealerId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        name: 'staffs_status',
        enum: staff_status_1.StaffStatus,
        nullable: true,
        default: staff_status_1.StaffStatus.ACTIVE
    }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "staffStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PermissionEntity.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PermissionEntity.prototype, "endDate", void 0);
exports.PermissionEntity = PermissionEntity = __decorate([
    (0, typeorm_1.Entity)('permissions')
], PermissionEntity);
class Permission {
}
exports.Permission = Permission;
//# sourceMappingURL=permissions.entity.js.map