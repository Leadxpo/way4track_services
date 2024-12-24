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
exports.ClientEntity = void 0;
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const appointement_entity_1 = require("../../appointment/entity/appointement.entity");
const work_allocation_entity_1 = require("../../work-allocation/entity/work-allocation.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const estimate_entity_1 = require("../../estimate/entity/estimate.entity");
const client_status_enum_1 = require("../enum/client-status.enum");
const request_raise_entity_1 = require("../../request-raise/entity/request-raise.entity");
let ClientEntity = class ClientEntity extends typeorm_1.BaseEntity {
};
exports.ClientEntity = ClientEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], ClientEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ClientEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], ClientEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_id', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], ClientEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_raise_entity_1.RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.staffId),
    __metadata("design:type", Array)
], ClientEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: client_status_enum_1.ClientStatusEnum, default: client_status_enum_1.ClientStatusEnum.ACCEPTED }),
    __metadata("design:type", String)
], ClientEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dob', type: 'date' }),
    __metadata("design:type", Date)
], ClientEntity.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], ClientEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text' }),
    __metadata("design:type", String)
], ClientEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'joining_date', type: 'date' }),
    __metadata("design:type", Date)
], ClientEntity.prototype, "joiningDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.client),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], ClientEntity.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_entity_1.VoucherEntity, (VoucherEntity) => VoucherEntity.client),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", voucher_entity_1.VoucherEntity)
], ClientEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointement_entity_1.AppointmentEntity, (asserts) => asserts.clientId),
    __metadata("design:type", Array)
], ClientEntity.prototype, "appiontment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estimate_entity_1.EstimateEntity, (asserts) => asserts.clientId),
    __metadata("design:type", Array)
], ClientEntity.prototype, "estimate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_allocation_entity_1.WorkAllocationEntity, (asserts) => asserts.clientId),
    __metadata("design:type", Array)
], ClientEntity.prototype, "workAllocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ClientEntity.prototype, "clientPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], ClientEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], ClientEntity.prototype, "unitCode", void 0);
exports.ClientEntity = ClientEntity = __decorate([
    (0, typeorm_1.Entity)('client')
], ClientEntity);
//# sourceMappingURL=client.entity.js.map