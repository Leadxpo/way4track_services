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
exports.VendorEntity = void 0;
const product_entity_1 = require("../../product/entity/product.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const typeorm_1 = require("typeorm");
let VendorEntity = class VendorEntity {
};
exports.VendorEntity = VendorEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], VendorEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], VendorEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_id', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], VendorEntity.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_phone_number', type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], VendorEntity.prototype, "vendorPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], VendorEntity.prototype, "alternatePhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], VendorEntity.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], VendorEntity.prototype, "vendorPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'starting_date', type: 'date' }),
    __metadata("design:type", Date)
], VendorEntity.prototype, "startingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], VendorEntity.prototype, "emailId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aadhar_number', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], VendorEntity.prototype, "aadharNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text' }),
    __metadata("design:type", String)
], VendorEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.ProductEntity, (product) => product.vendorId),
    __metadata("design:type", Array)
], VendorEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_entity_1.VoucherEntity, (VoucherEntity) => VoucherEntity.vendor),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", voucher_entity_1.VoucherEntity)
], VendorEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], VendorEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], VendorEntity.prototype, "unitCode", void 0);
exports.VendorEntity = VendorEntity = __decorate([
    (0, typeorm_1.Entity)('vendor')
], VendorEntity);
//# sourceMappingURL=vendor.entity.js.map