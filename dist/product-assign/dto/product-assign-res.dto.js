"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAssignResDto = void 0;
class ProductAssignResDto {
    constructor(id, staffId, staffName, branchId, branchName, productName, productType, imeiNumberFrom, imeiNumberTo, numberOfProducts, productAssignPhoto, companyCode, unitCode) {
        this.id = id;
        this.staffId = staffId;
        this.staffName = staffName;
        this.branchId = branchId;
        this.branchName = branchName;
        this.productName = productName;
        this.productType = productType;
        this.imeiNumberFrom = imeiNumberFrom;
        this.imeiNumberTo = imeiNumberTo;
        this.numberOfProducts = numberOfProducts;
        this.productAssignPhoto = productAssignPhoto;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
    }
}
exports.ProductAssignResDto = ProductAssignResDto;
//# sourceMappingURL=product-assign-res.dto.js.map