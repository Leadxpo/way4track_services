"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAssignAdapter = void 0;
const common_1 = require("@nestjs/common");
const product_assign_entity_1 = require("./entity/product-assign.entity");
let ProductAssignAdapter = class ProductAssignAdapter {
    convertDtoToEntity(dto) {
        const entity = new product_assign_entity_1.ProductAssignEntity();
        entity.id = dto.id;
        entity.staffId = { id: dto.staffId };
        entity.branchId = { id: dto.branchId };
        entity.productId = { id: dto.productId };
        entity.imeiNumberFrom = dto.imeiNumberFrom;
        entity.imeiNumberTo = dto.imeiNumberTo;
        entity.branchOrPerson = dto.branchOrPerson;
        entity.productAssignPhoto = dto.productAssignPhoto;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        if (dto.imeiNumberFrom && dto.imeiNumberTo) {
            entity.numberOfProducts = this.calculateNumberOfProducts(dto.imeiNumberFrom, dto.imeiNumberTo);
        }
        else {
            entity.numberOfProducts = 0;
        }
        return entity;
    }
    calculateNumberOfProducts(imeiFrom, imeiTo) {
        const imeiFromNum = parseInt(imeiFrom, 10);
        const imeiToNum = parseInt(imeiTo, 10);
        if (isNaN(imeiFromNum) || isNaN(imeiToNum) || imeiToNum < imeiFromNum) {
            throw new Error('Invalid IMEI range provided');
        }
        return imeiToNum - imeiFromNum + 1;
    }
};
exports.ProductAssignAdapter = ProductAssignAdapter;
exports.ProductAssignAdapter = ProductAssignAdapter = __decorate([
    (0, common_1.Injectable)()
], ProductAssignAdapter);
//# sourceMappingURL=product-assign.adapter.js.map