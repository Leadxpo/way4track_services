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
exports.AssertsEntity = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const payment_type_enum_1 = require("../enum/payment-type.enum");
var AssetType;
(function (AssetType) {
    AssetType["OFFICE_ASSET"] = "office asset";
    AssetType["TRANSPORT_ASSET"] = "transport asset";
})(AssetType || (exports.AssetType = AssetType = {}));
let AssertsEntity = class AssertsEntity {
};
exports.AssertsEntity = AssertsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssertsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asserts_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AssertsEntity.prototype, "assertsName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asserts_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssertsEntity.prototype, "assetPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asserts_amount', type: 'float' }),
    __metadata("design:type", Number)
], AssertsEntity.prototype, "assertsAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetType,
        name: 'asset_type',
        default: AssetType.OFFICE_ASSET,
    }),
    __metadata("design:type", String)
], AssertsEntity.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int' }),
    __metadata("design:type", Number)
], AssertsEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branch) => branch.asserts),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], AssertsEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssertsEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], AssertsEntity.prototype, "purchaseDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_entity_1.VoucherEntity, (voucher) => voucher.assert),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", voucher_entity_1.VoucherEntity)
], AssertsEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        name: 'payment_type',
        enum: payment_type_enum_1.PaymentType,
        default: payment_type_enum_1.PaymentType.CASH,
    }),
    __metadata("design:type", String)
], AssertsEntity.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'initial_payment', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AssertsEntity.prototype, "initialPayment", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'emi_count', nullable: true }),
    __metadata("design:type", Number)
], AssertsEntity.prototype, "numberOfEmi", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'emi_number', nullable: true }),
    __metadata("design:type", Number)
], AssertsEntity.prototype, "emiNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'emi_amount', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AssertsEntity.prototype, "emiAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], AssertsEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], AssertsEntity.prototype, "unitCode", void 0);
exports.AssertsEntity = AssertsEntity = __decorate([
    (0, typeorm_1.Entity)('asserts')
], AssertsEntity);
//# sourceMappingURL=asserts-entity.js.map