"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateDto = void 0;
class EstimateDto {
    constructor(id, clientId, buildingAddress, estimateDate, expireDate, productOrService, description, totalAmount, companyCode, unitCode, products, estimateId) {
        this.id = id;
        this.clientId = clientId;
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
    }
}
exports.EstimateDto = EstimateDto;
//# sourceMappingURL=estimate.dto.js.map