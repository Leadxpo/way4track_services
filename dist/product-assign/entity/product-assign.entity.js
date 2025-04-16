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
exports.ProductAssignEntity = void 0;
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const product_entity_1 = require("../../product/entity/product.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const request_raise_entity_1 = require("../../request-raise/entity/request-raise.entity");
const product_status_enum_1 = require("../../product/enum/product-status.enum");
const dispatch_entity_1 = require("../../dispatch/entity/dispatch.entity");
const product_type_entity_1 = require("../../product-type/entity/product-type.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
let ProductAssignEntity = class ProductAssignEntity extends typeorm_1.BaseEntity {
};
exports.ProductAssignEntity = ProductAssignEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductAssignEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.productAssign, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], ProductAssignEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.productAssign, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], ProductAssignEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dispatch_entity_1.DispatchEntity, (DispatchEntity) => DispatchEntity.staffId, { nullable: true }),
    __metadata("design:type", Array)
], ProductAssignEntity.prototype, "dispatch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity, (productEntity) => productEntity.productAssign, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], ProductAssignEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imei_number_from', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "imeiNumberFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imei_number_to', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "imeiNumberTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_of_products', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ProductAssignEntity.prototype, "numberOfProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sim_number_from', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "simNumberFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sim_number_to', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "simNumberTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_raise_entity_1.RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.productAssign, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'request_id' }),
    __metadata("design:type", request_raise_entity_1.RequestRaiseEntity)
], ProductAssignEntity.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sub_dealer_entity_1.SubDealerEntity, (requestRaiseEntity) => requestRaiseEntity.productAssign, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sub_dealer_id' }),
    __metadata("design:type", sub_dealer_entity_1.SubDealerEntity)
], ProductAssignEntity.prototype, "subDealerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_assign_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "productAssignPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_person', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "branchOrPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_assign', type: 'varchar', default: false, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "isAssign", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assign_time', type: 'timestamp', nullable: true, }),
    __metadata("design:type", Date)
], ProductAssignEntity.prototype, "assignTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assign_to', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "assignTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_type_entity_1.ProductTypeEntity, (ProductTypeEntity) => ProductTypeEntity.productAssign),
    (0, typeorm_1.JoinColumn)({ name: 'product_type_id' }),
    __metadata("design:type", product_type_entity_1.ProductTypeEntity)
], ProductAssignEntity.prototype, "productTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'in_hands', type: 'varchar', default: false, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "inHands", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 200, nullable: false }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 200, nullable: false }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: product_status_enum_1.ProductStatusEnum, default: product_status_enum_1.ProductStatusEnum.available }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProductAssignEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProductAssignEntity.prototype, "updatedAt", void 0);
exports.ProductAssignEntity = ProductAssignEntity = __decorate([
    (0, typeorm_1.Entity)('product_assignments')
], ProductAssignEntity);
//# sourceMappingURL=product-assign.entity.js.map