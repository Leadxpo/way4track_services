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
exports.VoucherEntity = exports.TypeEnum = exports.DebitORCreditEnum = void 0;
const typeorm_1 = require("typeorm");
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
const account_entity_1 = require("../../account/entity/account.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const estimate_entity_1 = require("../../estimate/entity/estimate.entity");
const work_allocation_entity_1 = require("../../work-allocation/entity/work-allocation.entity");
const appointement_entity_1 = require("../../appointment/entity/appointement.entity");
const technician_works_entity_1 = require("../../technician-works/entity/technician-works.entity");
const ledger_entity_1 = require("../../ledger/entity/ledger.entity");
var DebitORCreditEnum;
(function (DebitORCreditEnum) {
    DebitORCreditEnum["Debit"] = "Debit";
    DebitORCreditEnum["Credit"] = "Credit";
})(DebitORCreditEnum || (exports.DebitORCreditEnum = DebitORCreditEnum = {}));
var TypeEnum;
(function (TypeEnum) {
    TypeEnum["Rectifications"] = "Rectifications";
    TypeEnum["Renewables"] = "Renewables";
    TypeEnum["Replacements"] = "Replacements";
    TypeEnum["Product_Sales"] = "ProductSales";
    TypeEnum["Service_Sales"] = "ServiceSales";
    TypeEnum["Others"] = "Others";
})(TypeEnum || (exports.TypeEnum = TypeEnum = {}));
let VoucherEntity = class VoucherEntity {
};
exports.VoucherEntity = VoucherEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'upi_id', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "upiId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "checkNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "cardNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.AccountEntity, (account) => account.vouchersFrom, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'from_account_id' }),
    __metadata("design:type", account_entity_1.AccountEntity)
], VoucherEntity.prototype, "fromAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.AccountEntity, (account) => account.vouchersTo, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'to_account_id' }),
    __metadata("design:type", account_entity_1.AccountEntity)
], VoucherEntity.prototype, "toAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voucher_id', type: 'varchar', length: 50, unique: true, nullable: false }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => technician_works_entity_1.TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branch) => branch.voucher, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], VoucherEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ledger_entity_1.LedgerEntity, (branch) => branch.voucher, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ledger_id' }),
    __metadata("design:type", ledger_entity_1.LedgerEntity)
], VoucherEntity.prototype, "ledgerId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purpose', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        name: 'payment_type',
        enum: payment_type_enum_1.PaymentType,
        nullable: true
    }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voucher_type', type: 'enum', enum: voucher_type_enum_1.VoucherTypeEnum }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "voucherType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'generation_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true }),
    __metadata("design:type", Date)
], VoucherEntity.prototype, "generationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true }),
    __metadata("design:type", Date)
], VoucherEntity.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expire_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], VoucherEntity.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_address', type: 'varchar', length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_location', type: 'varchar', length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "supplierLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'building_address', type: 'varchar', length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "buildingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hsn_code', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "hsnCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journal_type', type: 'enum', nullable: true, enum: DebitORCreditEnum }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "journalType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sgst', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "SGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cgst', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "CGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'voucher_gst', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "voucherGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'igst', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "IGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tds', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "TDS", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tcs', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "TCS", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_amount', type: 'float', nullable: true, default: null }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "creditAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remining_amount', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "reminigAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity, (ProductEntity) => ProductEntity.voucherId, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], VoucherEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: payment_status_enum_1.PaymentStatus,
        name: 'payment_status',
        default: payment_status_enum_1.PaymentStatus.PENDING,
        nullable: true
    }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: product_type_enum_1.ProductType,
        name: 'product_type',
        nullable: true
    }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.VendorEntity, (VendorEntity) => VendorEntity.voucherId, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", vendor_entity_1.VendorEntity)
], VoucherEntity.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.ClientEntity, (ClientEntity) => ClientEntity.voucherId, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.ClientEntity)
], VoucherEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (StaffEntity) => StaffEntity.voucherId, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], VoucherEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (StaffEntity) => StaffEntity.voucher, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'payment_to' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], VoucherEntity.prototype, "paymentTo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asserts_entity_1.AssertsEntity, (voucher) => voucher.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "assert", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointement_entity_1.AppointmentEntity, (voucher) => voucher.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_allocation_entity_1.WorkAllocationEntity, (voucher) => voucher.voucherId),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "workAllocation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sub_dealer_entity_1.SubDealerEntity, (SubDealerEntity) => SubDealerEntity.voucherId, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sub_dealer_id' }),
    __metadata("design:type", sub_dealer_entity_1.SubDealerEntity)
], VoucherEntity.prototype, "subDealer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], VoucherEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], VoucherEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'invoice_id', length: 20, nullable: true }),
    __metadata("design:type", String)
], VoucherEntity.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estimate_entity_1.EstimateEntity, (Estimate) => Estimate.invoice, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'invoice', referencedColumnName: 'id' }),
    __metadata("design:type", estimate_entity_1.EstimateEntity)
], VoucherEntity.prototype, "estimate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'paid_amount', nullable: true }),
    __metadata("design:type", Number)
], VoucherEntity.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'product_details', nullable: true }),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "productDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'pending_invoices', nullable: true }),
    __metadata("design:type", Array)
], VoucherEntity.prototype, "pendingInvoices", void 0);
exports.VoucherEntity = VoucherEntity = __decorate([
    (0, typeorm_1.Entity)('voucher')
], VoucherEntity);
//# sourceMappingURL=voucher.entity.js.map