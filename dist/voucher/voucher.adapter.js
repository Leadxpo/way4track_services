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
let VoucherAdapter = class VoucherAdapter {
    entityToDto(entity) {
        return {
            id: entity.id,
            name: entity.name,
            quantity: entity.quantity,
            branchId: entity.branchId?.id || 0,
            branchName: entity.branchId?.branchName || "Unknown",
            role: entity.role,
            purpose: entity.purpose,
            creditAmount: entity.creditAmount,
            paymentType: entity.paymentType,
            client: entity.client && entity.client[0] ? entity.client[0].id : null,
            clientName: entity.client && entity.client[0] ? entity.client[0].name : "Unknown",
            paymentTo: entity.paymentTo,
            debitAmount: entity.debitAmount,
            transferredBy: entity.transferredBy,
            bankFrom: entity.bankFrom,
            bankTo: entity.bankTo,
            voucherType: entity.voucherType,
            generationDate: entity.generationDate,
            expireDate: entity.expireDate,
            shippingAddress: entity.shippingAddress,
            buildingAddress: entity.buildingAddress,
            balanceAmount: entity.balanceAmount,
            total: entity.total,
            hsnCode: entity.hsnCode,
            GST: entity.GST,
            SCST: entity.SCST,
            CGST: entity.CGST,
            amount: entity.amount,
            subDealerId: entity.subDealer && entity.subDealer[0] ? entity.subDealer[0].id : null,
            subDealerName: entity.subDealer && entity.subDealer[0] ? entity.subDealer[0].name : "",
            vendorId: entity.vendor && entity.vendor[0] ? entity.vendor[0].id : null,
            vendorName: entity.vendor && entity.vendor[0] ? entity.vendor[0].name : "Unknown",
            voucherId: entity.voucherId,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            initialPayment: entity.initialPayment,
            emiCount: entity.numberOfEmi,
            emiNumber: entity.emiNumber,
            emiAmount: entity.emiAmount,
            ifscCode: entity.ifscCode,
            bankAccountNumber: entity.bankAccountNumber,
            ledgerAmount: entity.balanceAmount + entity.GST + entity.SCST + entity.CGST,
        };
    }
    dtoToEntity(dto, branch, client, subDealer, vendor) {
        const entity = new voucher_entity_1.VoucherEntity();
        entity.name = dto.name;
        entity.branchId = branch;
        entity.role = dto.role;
        entity.purpose = dto.purpose;
        entity.creditAmount = dto.creditAmount;
        entity.paymentType = dto.paymentType;
        entity.quantity = dto.quantity;
        if (client) {
            entity.client = [client];
        }
        if (subDealer) {
            entity.subDealer = [subDealer];
        }
        if (vendor) {
            entity.vendor = [vendor];
        }
        entity.paymentTo = dto.paymentTo;
        entity.debitAmount = dto.debitAmount;
        entity.transferredBy = dto.transferredBy;
        entity.bankFrom = dto.bankFrom;
        entity.bankTo = dto.bankTo;
        entity.voucherType = dto.voucherType;
        entity.generationDate = dto.generationDate;
        entity.expireDate = dto.expireDate;
        entity.shippingAddress = dto.shippingAddress;
        entity.buildingAddress = dto.buildingAddress;
        entity.balanceAmount = dto.balanceAmount;
        entity.total = dto.total;
        entity.hsnCode = dto.hsnCode;
        entity.GST = dto.GST;
        entity.SCST = dto.SCST;
        entity.CGST = dto.CGST;
        entity.amount = dto.amount;
        entity.initialPayment = dto.initialPayment;
        entity.numberOfEmi = dto.numberOfEmi;
        entity.emiNumber = dto.emiNumber;
        entity.emiAmount = dto.emiAmount;
        entity.ifscCode = dto.ifscCode;
        entity.bankAccountNumber = dto.bankAccountNumber;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        return entity;
    }
};
exports.VoucherAdapter = VoucherAdapter;
exports.VoucherAdapter = VoucherAdapter = __decorate([
    (0, common_1.Injectable)()
], VoucherAdapter);
//# sourceMappingURL=voucher.adapter.js.map