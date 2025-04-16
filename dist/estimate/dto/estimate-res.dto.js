"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateResDto = void 0;
class EstimateResDto {
    constructor(id, clientId, clientName, clientAddress, clientEmail, clientPhoneNumber, buildingAddress, estimateDate, expireDate, productOrService, description, totalAmount, companyCode, unitCode, products, estimateId, invoiceId, SCST, CGST, vendorId, vendorName, vendorPhoneNumber, estimatePdfUrl, invoicePdfUrl) {
        this.id = id;
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientAddress = clientAddress;
        this.clientEmail = clientEmail;
        this.clientPhoneNumber = clientPhoneNumber;
        this.buildingAddress = buildingAddress;
        this.estimateDate = estimateDate;
        this.expireDate = expireDate;
        this.productOrService = productOrService;
        this.description = description;
        this.totalAmount = totalAmount;
        this.products = products;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.estimateId = estimateId;
        this.invoiceId = invoiceId;
        this.SCST = SCST;
        this.CGST = CGST;
        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.vendorPhoneNumber = vendorPhoneNumber;
        this.estimatePdfUrl = estimatePdfUrl;
        this.invoicePdfUrl = invoicePdfUrl;
    }
}
exports.EstimateResDto = EstimateResDto;
//# sourceMappingURL=estimate-res.dto.js.map