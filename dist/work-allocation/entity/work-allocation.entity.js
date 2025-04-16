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
const branch_entity_1 = require("../../branch/entity/branch.entity");
const client_entity_1 = require("../../client/entity/client.entity");
const product_entity_1 = require("../../product/entity/product.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const vendor_entity_1 = require("../../vendor/entity/vendor.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const typeorm_1 = require("typeorm");
const work_status_enum_1 = require("../enum/work-status-enum");
const technician_works_entity_1 = require("../../technician-works/entity/technician-works.entity");
const estimate_entity_1 = require("../../estimate/entity/estimate.entity");
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
    (0, typeorm_1.Column)({ name: 'service_or_product', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "serviceOrProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'other_information', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "otherInformation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: work_status_enum_1.WorkStatusEnum, name: 'work_status', default: work_status_enum_1.WorkStatusEnum.PENDING, nullable: true }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "workStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true }),
    __metadata("design:type", Date)
], WorkAllocationEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.workAllocation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], WorkAllocationEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (BranchEntity) => BranchEntity.workAllocation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], WorkAllocationEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity, (ProductEntity) => ProductEntity.workAllocation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], WorkAllocationEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.VendorEntity, (VendorEntity) => VendorEntity.workAllocation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", vendor_entity_1.VendorEntity)
], WorkAllocationEntity.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.ClientEntity, (ClientEntity) => ClientEntity.workAllocation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.ClientEntity)
], WorkAllocationEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_entity_1.VoucherEntity, (VoucherEntity) => VoucherEntity.workAllocation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", voucher_entity_1.VoucherEntity)
], WorkAllocationEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => technician_works_entity_1.TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.workId),
    __metadata("design:type", Array)
], WorkAllocationEntity.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 200, nullable: false }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 200, nullable: false }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], WorkAllocationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], WorkAllocationEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'product_name', nullable: true }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WorkAllocationEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'visitingNumber', length: 200, nullable: true }),
    __metadata("design:type", String)
], WorkAllocationEntity.prototype, "visitingNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (designation) => designation.sales, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sales_id', referencedColumnName: 'id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], WorkAllocationEntity.prototype, "salesStaffRelation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estimate_entity_1.EstimateEntity, (Estimate) => Estimate.work, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'estimate_id', referencedColumnName: 'id' }),
    __metadata("design:type", estimate_entity_1.EstimateEntity)
], WorkAllocationEntity.prototype, "estimateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estimate_entity_1.EstimateEntity, (Estimate) => Estimate.workId, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'invoice_id', referencedColumnName: 'id' }),
    __metadata("design:type", estimate_entity_1.EstimateEntity)
], WorkAllocationEntity.prototype, "invoiceId", void 0);
exports.WorkAllocationEntity = WorkAllocationEntity = __decorate([
    (0, typeorm_1.Entity)('work_allocations')
], WorkAllocationEntity);
//# sourceMappingURL=work-allocation.entity.js.map