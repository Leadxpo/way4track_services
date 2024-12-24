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
exports.VoucherEntity = void 0;
const typeorm_1 = require("typeorm");
const role_enum_1 = require("../enum/role-enum");
const voucher_type_enum_1 = require("../enum/voucher-type-enum");
const payment_type_enum_1 = require("../../asserts/enum/payment-type.enum");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const product_entity_1 = require("../../product/entity/product.entity");
const payment_status_enum_1 = require("../../product/dto/payment-status.enum");
const product_type_enum_1 = require("../../product/dto/product-type.enum");
const client_entity_1 = require("../../client/entity/client.entity");
const vendor_entity_1 = require("../../vendor/entity/vendor.entity");
const asserts_entity_1 = require("../../asserts/entity/asserts-entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
let VoucherEntity = class VoucherEntity {
};
exports.VoucherEntity = VoucherEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int' }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voucher_id', type: 'varchar' }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (BranchEntity) => BranchEntity.voucher),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], VoucherEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: role_enum_1.RoleEnum, name: 'role', default: role_enum_1.RoleEnum.CLIENT }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purpose', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_amount', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "creditAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        name: 'payment_type',
        enum: payment_type_enum_1.PaymentType,
        default: payment_type_enum_1.PaymentType.CASH,
    }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_to', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "paymentTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'debit_amount', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "debitAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transferred_by', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "transferredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_from', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "bankFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_to', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "bankTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voucher_type', type: 'enum', enum: voucher_type_enum_1.VoucherTypeEnum, default: voucher_type_enum_1.VoucherTypeEnum.INVOICE }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "voucherType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'generation_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], VoucherEntity.prototype, "generationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expire_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], VoucherEntity.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_address', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'building_address', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "buildingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_amount', type: 'float' }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "balanceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total', type: 'float' }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hsn_code', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "hsnCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gst', type: 'float' }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "GST", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scst', type: 'float' }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "SCST", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cgst', type: 'float' }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "CGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', type: 'float' }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.ProductEntity, product => product.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: payment_status_enum_1.PaymentStatus,
        name: 'payment_status',
        default: payment_status_enum_1.PaymentStatus.ACCEPTED,
    }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: product_type_enum_1.ProductType,
        name: 'product_type',
        default: product_type_enum_1.ProductType.product,
    }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => client_entity_1.ClientEntity, (voucher) => voucher.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vendor_entity_1.VendorEntity, (voucher) => voucher.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'initial_payment', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "initialPayment", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'emi_count', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "numberOfEmi", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'emi_number', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "emiNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'emi_amount', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "emiAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'ifsc_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "ifscCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'bank_account_number', length: 20, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "bankAccountNumber", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asserts_entity_1.AssertsEntity, (voucher) => voucher.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "assert", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sub_dealer_entity_1.SubDealerEntity, (voucher) => voucher.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "subDealer", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "unitCode", void 0);
exports.VoucherEntity = VoucherEntity = __decorate([
    (0, typeorm_1.Entity)('voucher')
], VoucherEntity);
//# sourceMappingURL=voucher.entity.js.map