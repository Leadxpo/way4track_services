"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherAdapter = void 0;
const common_1 = require("@nestjs/common");
const voucher_entity_1 = require("./entity/voucher.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
const client_entity_1 = require("../client/entity/client.entity");
const sub_dealer_entity_1 = require("../sub-dealer/entity/sub-dealer.entity");
const vendor_entity_1 = require("../vendor/entity/vendor.entity");
const account_entity_1 = require("../account/entity/account.entity");
const voucher_res_dto_1 = require("./dto/voucher-res.dto");
const staff_entity_1 = require("../staff/entity/staff.entity");
const product_entity_1 = require("../product/entity/product.entity");
const estimate_entity_1 = require("../estimate/entity/estimate.entity");
const ledger_entity_1 = require("../ledger/entity/ledger.entity");
let VoucherAdapter = class VoucherAdapter {
    dtoToEntity(dto) {
        const entity = new voucher_entity_1.VoucherEntity();
        entity.name = dto.name;
        const branch = new branch_entity_1.BranchEntity();
        branch.id = dto.branchId;
        entity.branchId = branch;
        entity.invoiceId = dto.invoiceId;
        if (dto.toAccount) {
            const toAccount = new account_entity_1.AccountEntity();
            toAccount.id = dto.toAccount;
            entity.toAccount = toAccount;
        }
        if (dto.fromAccount) {
            const fromAccount = new account_entity_1.AccountEntity();
            fromAccount.id = dto.fromAccount;
            entity.fromAccount = fromAccount;
        }
        const client = new client_entity_1.ClientEntity();
        client.clientId = dto.clientId;
        entity.clientId = client;
        const staff = new staff_entity_1.StaffEntity();
        staff.id = dto.staffId;
        entity.staffId = staff;
        const payment = new staff_entity_1.StaffEntity();
        staff.id = dto.staffId;
        entity.staffId = payment;
        const product = new product_entity_1.ProductEntity();
        product.id = dto.product;
        entity.product = product;
        const subDealer = new sub_dealer_entity_1.SubDealerEntity();
        subDealer.id = dto.subDealerId;
        entity.subDealer = subDealer;
        const vendor = new vendor_entity_1.VendorEntity();
        vendor.id = dto.vendorId;
        entity.vendorId = vendor;
        const estimatePayment = new estimate_entity_1.EstimateEntity();
        estimatePayment.id = dto.estimate;
        entity.estimate = estimatePayment;
        entity.invoiceId = dto.invoiceId;
        entity.purpose = dto.purpose;
        entity.creditAmount = dto.creditAmount;
        entity.paymentType = dto.paymentType;
        entity.quantity = dto.quantity;
        entity.voucherType = dto.voucherType;
        entity.generationDate = dto.generationDate;
        entity.expireDate = dto.expireDate;
        entity.shippingAddress = dto.shippingAddress;
        entity.buildingAddress = dto.buildingAddress;
        entity.hsnCode = dto.hsnCode;
        entity.journalType = dto.journalType;
        entity.SGST = dto.SGST;
        entity.CGST = dto.CGST;
        entity.amount = dto.amount;
        if (dto.creditAmount && dto.amount) {
            entity.reminigAmount = dto.creditAmount - dto.amount;
        }
        else {
            entity.reminigAmount = dto.reminigAmount;
        }
        entity.upiId = dto.upiId;
        entity.checkNumber = dto.checkNumber;
        entity.checkNumber = dto.checkNumber;
        entity.cardNumber = dto.cardNumber;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.paymentStatus = dto.paymentStatus;
        entity.voucherId = dto.voucherId;
        if (dto.id) {
            entity.id = dto.id;
        }
        if (dto.ledgerId) {
            const ledger = new ledger_entity_1.LedgerEntity();
            ledger.id = dto.ledgerId;
            entity.ledgerId = ledger;
        }
        entity.voucherGST = dto.voucherGST;
        entity.supplierLocation = dto.supplierLocation;
        entity.paidAmount = dto.paidAmount;
        entity.TDS = dto.TDS;
        entity.TCS = dto.TCS;
        entity.pendingInvoices = dto.pendingInvoices;
        entity.dueDate = dto.dueDate;
        return entity;
    }
    entityToDto(entity) {
        if (Array.isArray(entity)) {
            return entity.map((voucher) => {
                return new voucher_res_dto_1.VoucherResDto(voucher.id, voucher.name, voucher.branchId?.id || 0, voucher.branchId?.branchName || "Unknown", voucher.purpose, voucher.creditAmount, voucher.paymentType, voucher.clientId?.clientId || "", voucher.clientId?.name || "Unknown", voucher.staffId?.staffId || "", voucher.staffId?.name || "", voucher.toAccount?.accountName || "", voucher.fromAccount?.accountName || "", voucher.voucherType, voucher.voucherId, voucher.companyCode, voucher.unitCode, voucher.paymentStatus, voucher.productType, voucher.vendorId ? voucher.vendorId.id : null, voucher.vendorId ? voucher.vendorId.name : "", voucher.quantity, voucher.generationDate, voucher.expireDate, voucher.shippingAddress, voucher.buildingAddress, voucher.reminigAmount, voucher.hsnCode, voucher.journalType, voucher.SGST, voucher.CGST, voucher.amount, voucher.subDealer ? voucher.subDealer.id : null, voucher.subDealer ? voucher.subDealer.name : "", voucher.upiId, voucher.checkNumber, voucher.cardNumber, voucher.fromAccount?.accountNumber || "", voucher.toAccount?.accountNumber || "", voucher.product?.id || null, voucher.product?.productName || "", voucher.estimate?.id || null, voucher.estimate?.invoiceId, voucher.staffId?.name || "", voucher.estimate?.receiptPdfUrl ? voucher.estimate.receiptPdfUrl : "", voucher?.dueDate ? voucher.dueDate : null, voucher?.productDetails ? voucher.productDetails : []);
            });
        }
        else {
            const voucher = entity;
            return [
                new voucher_res_dto_1.VoucherResDto(voucher.id, voucher.name, voucher.branchId?.id || 0, voucher.branchId?.branchName || "Unknown", voucher.purpose, voucher.creditAmount, voucher.paymentType, voucher.clientId?.clientId || "", voucher.clientId?.name || "Unknown", voucher.staffId?.staffId || "", voucher.staffId?.name || "", voucher.toAccount?.accountName || "", voucher.fromAccount?.accountName || "", voucher.voucherType, voucher.voucherId, voucher.companyCode, voucher.unitCode, voucher.paymentStatus, voucher.productType, voucher.vendorId ? voucher.vendorId.id : null, voucher.vendorId ? voucher.vendorId.name : "", voucher.quantity, voucher.generationDate, voucher.expireDate, voucher.shippingAddress, voucher.buildingAddress, voucher.reminigAmount, voucher.hsnCode, voucher.journalType, voucher.SGST, voucher.CGST, voucher.amount, voucher.subDealer ? voucher.subDealer.id : null, voucher.subDealer ? voucher.subDealer.name : "", voucher.upiId, voucher.checkNumber, voucher.cardNumber, voucher.fromAccount?.accountNumber || "", voucher.toAccount?.accountNumber || "", voucher.product?.id || null, voucher.product?.productName || "", voucher.estimate?.id || null, voucher.estimate?.invoiceId, voucher.staffId?.name || "", voucher.estimate?.receiptPdfUrl ? voucher.estimate.receiptPdfUrl : "", voucher?.dueDate ? voucher.dueDate : null, voucher?.productDetails ? voucher.productDetails : [])
            ];
        }
    }
};
exports.VoucherAdapter = VoucherAdapter;
exports.VoucherAdapter = VoucherAdapter = __decorate([
    (0, common_1.Injectable)()
], VoucherAdapter);
//# sourceMappingURL=voucher.adapter.js.map