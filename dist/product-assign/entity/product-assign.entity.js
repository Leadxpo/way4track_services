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
let ProductAssignEntity = class ProductAssignEntity extends typeorm_1.BaseEntity {
};
exports.ProductAssignEntity = ProductAssignEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductAssignEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.productAssign),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], ProductAssignEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.productAssign),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], ProductAssignEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity, (productEntity) => productEntity.productAssign),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], ProductAssignEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imei_number_from', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "imeiNumberFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imei_number_to', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "imeiNumberTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'number_of_products', type: 'int' }),
    __metadata("design:type", Number)
], ProductAssignEntity.prototype, "numberOfProducts", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_raise_entity_1.RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.productAssign),
    (0, typeorm_1.JoinColumn)({ name: 'request_id' }),
    __metadata("design:type", request_raise_entity_1.RequestRaiseEntity)
], ProductAssignEntity.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_assign_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "productAssignPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_person', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "branchOrPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_qty', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ProductAssignEntity.prototype, "assignedQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_assign', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProductAssignEntity.prototype, "isAssign", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assign_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ProductAssignEntity.prototype, "assignTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assign_to', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "assignTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'in_hands', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProductAssignEntity.prototype, "inHands", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], ProductAssignEntity.prototype, "unitCode", void 0);
exports.ProductAssignEntity = ProductAssignEntity = __decorate([
    (0, typeorm_1.Entity)('product_assignments')
], ProductAssignEntity);
//# sourceMappingURL=product-assign.entity.js.map