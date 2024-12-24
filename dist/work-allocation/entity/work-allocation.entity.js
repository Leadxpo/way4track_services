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
exports.WorkAllocationEntity = void 0;
const client_entity_1 = require("../../client/entity/client.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const typeorm_1 = require("typeorm");
let WorkAllocationEntity = class WorkAllocationEntity extends typeorm_1.BaseEntity {
};
exports.WorkAllocationEntity = WorkAllocationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WorkAllocationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_allocation_number', type: 'varchar', unique: true }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "workAllocationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_or_product', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "serviceOrProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'other_information', type: 'text' }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "otherInformation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'date' }),
    __metadata("design:type", Date)
], WorkAllocationEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.workAllocation),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], WorkAllocationEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.ClientEntity, (ClientEntity) => ClientEntity.workAllocation),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.ClientEntity)
], WorkAllocationEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "unitCode", void 0);
exports.WorkAllocationEntity = WorkAllocationEntity = __decorate([
    (0, typeorm_1.Entity)('work_allocations')
], WorkAllocationEntity);
//# sourceMappingURL=work-allocation.entity.js.map