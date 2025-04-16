"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherResDto = void 0;
class VoucherResDto {
    constructor(id, name, branchId, branchName, purpose, creditAmount, paymentType, clientId, clientName, staffId, staffName, toAccount, fromAccount, voucherType, voucherId, companyCode, unitCode, paymentStatus, productType, vendorId, vendorName, quantity, generationDate, expireDate, shippingAddress, buildingAddress, remainingAmount, hsnCode, GSTORTDS, SCST, CGST, amount, subDealerId, subDealerName, upiId, checkNumber, cardNumber, fromAccountId, toAccountId, product, productName, invoice, invoiceId, paymentTo, receiptPdfUrl, dueDate, productDetails) {
        this.id = id;
        this.name = name;
        this.branchId = branchId;
        this.branchName = branchName;
        this.purpose = purpose;
        this.creditAmount = creditAmount;
        this.paymentType = paymentType;
        this.clientId = clientId;
        this.clientName = clientName;
        this.staffId = staffId;
        this.staffName = staffName;
        this.toAccount = toAccount;
        this.fromAccount = fromAccount;
        this.voucherType = voucherType;
        this.voucherId = voucherId;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.paymentStatus = paymentStatus;
        this.productType = productType;
        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.quantity = quantity ?? 0;
        this.generationDate = generationDate ?? null;
        this.expireDate = expireDate ?? null;
        this.shippingAddress = shippingAddress ?? "";
        this.buildingAddress = buildingAddress ?? "";
        this.remainingAmount = remainingAmount ?? 0;
        this.hsnCode = hsnCode ?? "";
        this.GSTORTDS = GSTORTDS ?? null;
        this.SCST = SCST ?? 0;
        this.CGST = CGST ?? 0;
        this.amount = amount ?? 0;
        this.subDealerId = subDealerId ?? null;
        this.subDealerName = subDealerName ?? "";
        this.upiId = upiId ?? "";
        this.checkNumber = checkNumber ?? "";
        this.cardNumber = cardNumber ?? "";
        this.toAccountId = toAccountId;
        this.fromAccountId = fromAccountId;
        this.product = product;
        this.productName = productName;
        this.invoice = invoice;
        this.invoiceId = invoiceId;
        this.paymentTo = paymentTo;
        this.receiptPdfUrl = receiptPdfUrl;
        this.dueDate = dueDate;
        this.productDetails = productDetails;
    }
}
exports.VoucherResDto = VoucherResDto;
//# sourceMappingURL=voucher-res.dto.js.map