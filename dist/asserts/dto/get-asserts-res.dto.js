"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAssertsResDto = void 0;
class GetAssertsResDto {
    constructor(id, branchId, branchName, assertsName, assertsAmount, assetType, price, quantity, description, purchaseDate, assetPhoto, paymentType, companyCode, unitCode, initialPayment, numberOfEmi, emiNumber, emiAmount) {
        this.id = id;
        this.branchId = branchId;
        this.branchName = branchName;
        this.assertsName = assertsName;
        this.assertsAmount = assertsAmount;
        this.assetType = assetType;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.purchaseDate = purchaseDate;
        this.assetPhoto = assetPhoto;
        this.paymentType = paymentType;
        this.initialPayment = initialPayment;
        this.numberOfEmi = numberOfEmi;
        this.emiNumber = emiNumber;
        this.emiAmount = emiAmount;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
    }
}
exports.GetAssertsResDto = GetAssertsResDto;
//# sourceMappingURL=get-asserts-res.dto.js.map