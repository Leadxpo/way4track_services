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
exports.ProductEntity = void 0;
const product_assign_entity_1 = require("../../product-assign/entity/product-assign.entity");
const vendor_entity_1 = require("../../vendor/entity/vendor.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const typeorm_1 = require("typeorm");
let ProductEntity = class ProductEntity extends typeorm_1.BaseEntity {
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emi_number', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "emiNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_purchase', type: 'date' }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "dateOfPurchase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imei_number', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "imeiNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_name', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_description', type: 'text' }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productDescription", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.VendorEntity, (vendorEntity) => vendorEntity.product),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", vendor_entity_1.VendorEntity)
], ProductEntity.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_entity_1.VoucherEntity, (voucherEntity) => voucherEntity.product),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", voucher_entity_1.VoucherEntity)
], ProductEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_assign_entity_1.ProductAssignEntity, (product) => product.productId),
    __metadata("design:type", Array)
], ProductEntity.prototype, "productAssign", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], ProductEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], ProductEntity.prototype, "unitCode", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, typeorm_1.Entity)('products')
], ProductEntity);
//# sourceMappingURL=product.entity.js.map