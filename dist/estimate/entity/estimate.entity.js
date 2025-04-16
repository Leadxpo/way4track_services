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
exports.EstimateEntity = exports.GSTORTDSEnum = void 0;
const client_entity_1 = require("../../client/entity/client.entity");
const client_status_enum_1 = require("../../client/enum/client-status.enum");
const product_entity_1 = require("../../product/entity/product.entity");
const vendor_entity_1 = require("../../vendor/entity/vendor.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const work_allocation_entity_1 = require("../../work-allocation/entity/work-allocation.entity");
const typeorm_1 = require("typeorm");
var GSTORTDSEnum;
(function (GSTORTDSEnum) {
    GSTORTDSEnum["GST"] = "GST";
    GSTORTDSEnum["TDS"] = "TDS";
})(GSTORTDSEnum || (exports.GSTORTDSEnum = GSTORTDSEnum = {}));
let EstimateEntity = class EstimateEntity extends typeorm_1.BaseEntity {
};
exports.EstimateEntity = EstimateEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EstimateEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.ClientEntity, (ClientEntity) => ClientEntity.workAllocation, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.ClientEntity)
], EstimateEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.VendorEntity, (VendorEntity) => VendorEntity.estimate, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", vendor_entity_1.VendorEntity)
], EstimateEntity.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'building_address', nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "buildingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimate_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], EstimateEntity.prototype, "estimateDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'estimate_id', nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "estimateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'invoice_id', nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'expire_date', nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'product_or_service', nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "productOrService", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'description', nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', name: 'amount', nullable: true }),
    __metadata("design:type", Number)
], EstimateEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', name: 'quantity', nullable: true }),
    __metadata("design:type", Number)
], EstimateEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.ProductEntity, (product) => product.estimate),
    __metadata("design:type", Array)
], EstimateEntity.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_entity_1.VoucherEntity, (product) => product.estimate),
    __metadata("design:type", Array)
], EstimateEntity.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_allocation_entity_1.WorkAllocationEntity, (product) => product.estimateId),
    __metadata("design:type", Array)
], EstimateEntity.prototype, "work", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_allocation_entity_1.WorkAllocationEntity, (product) => product.invoiceId),
    __metadata("design:type", Array)
], EstimateEntity.prototype, "workId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'product_details', nullable: true }),
    __metadata("design:type", Array)
], EstimateEntity.prototype, "productDetails", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gst/tds', type: 'enum', nullable: true, enum: GSTORTDSEnum }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "GSTORTDS", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', nullable: true, enum: client_status_enum_1.ClientStatusEnum }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scst', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], EstimateEntity.prototype, "SCST", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cgst', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], EstimateEntity.prototype, "CGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "estimatePdfUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "invoicePdfUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "receiptPdfUrl", void 0);
exports.EstimateEntity = EstimateEntity = __decorate([
    (0, typeorm_1.Entity)('estimates')
], EstimateEntity);
//# sourceMappingURL=estimate.entity.js.map