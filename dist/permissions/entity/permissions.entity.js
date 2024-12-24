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
const staff_entity_1 = require("../../staff/entity/staff.entity");
const typeorm_1 = require("typeorm");
const role_enum_1 = require("../dto/role.enum");
let PermissionEntity = class PermissionEntity {
};
exports.PermissionEntity = PermissionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PermissionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'user_id', nullable: false }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'user_name', nullable: false }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15, name: 'phone_number', nullable: false }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        name: 'permissions',
        nullable: false,
        comment: 'Array of permissions with add, edit, and view flags',
    }),
    __metadata("design:type", Array)
], PermissionEntity.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'designation',
        type: 'enum',
        enum: staff_entity_1.DesignationEnum
    }),
    __metadata("design:type", String)
], PermissionEntity.prototype, "designation", void 0);
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
exports.PermissionEntity = PermissionEntity = __decorate([
    (0, typeorm_1.Entity)('permissions')
], PermissionEntity);
class Permission {
}
exports.Permission = Permission;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false, name: 'name' }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, nullable: false, name: 'add' }),
    __metadata("design:type", Boolean)
], Permission.prototype, "add", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, nullable: false, name: 'edit' }),
    __metadata("design:type", Boolean)
], Permission.prototype, "edit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, nullable: false, name: 'view' }),
    __metadata("design:type", Boolean)
], Permission.prototype, "view", void 0);
//# sourceMappingURL=permissions.entity.js.map