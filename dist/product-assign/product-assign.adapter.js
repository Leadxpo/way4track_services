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
const staff_entity_1 = require("../staff/entity/staff.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
const product_entity_1 = require("../product/entity/product.entity");
const request_raise_entity_1 = require("../request-raise/entity/request-raise.entity");
const product_type_entity_1 = require("../product-type/entity/product-type.entity");
const sub_dealer_entity_1 = require("../sub-dealer/entity/sub-dealer.entity");
let ProductAssignAdapter = class ProductAssignAdapter {
    convertDtoToEntity(dto) {
        const entity = new product_assign_entity_1.ProductAssignEntity();
        entity.id = dto.id;
        if (dto.staffId) {
            const staff = new staff_entity_1.StaffEntity();
            staff.id = dto.staffId;
            entity.staffId = staff;
        }
        if (dto.branchId) {
            const branch = new branch_entity_1.BranchEntity();
            branch.id = dto.branchId;
            entity.branchId = branch;
        }
        if (dto.requestId) {
            const request = new request_raise_entity_1.RequestRaiseEntity();
            request.id = dto.requestId;
            entity.requestId = request;
        }
        if (dto.subDealerId) {
            const sub = new sub_dealer_entity_1.SubDealerEntity();
            sub.id = dto.subDealerId;
            entity.subDealerId = sub;
        }
        if (dto.productTypeId) {
            const product = new product_type_entity_1.ProductTypeEntity();
            product.id = dto.productTypeId;
            entity.productTypeId = product;
        }
        if (dto.productId) {
            const product = new product_entity_1.ProductEntity();
            product.id = dto.productId;
            entity.productId = product;
        }
        entity.imeiNumberFrom = dto.imeiNumberFrom || null;
        entity.imeiNumberTo = dto.imeiNumberTo || null;
        entity.simNumberFrom = dto.simNumberFrom || null;
        entity.simNumberTo = dto.simNumberTo || null;
        entity.branchOrPerson = dto.branchOrPerson || null;
        entity.productAssignPhoto = dto.productAssignPhoto || null;
        entity.isAssign = dto.isAssign;
        entity.inHands = dto.inHands;
        entity.assignTime = dto.assignTime;
        entity.assignTo = dto.assignTo;
        entity.status = dto.status;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        if (dto.imeiNumberFrom && dto.imeiNumberTo) {
            entity.numberOfProducts = this.calculateNumberOfProducts(dto.imeiNumberFrom, dto.imeiNumberTo);
        }
        else {
            entity.numberOfProducts = dto.numberOfProducts;
        }
        return entity;
    }
    calculateNumberOfProducts(imeiFrom, imeiTo) {
        const from = parseInt(imeiFrom, 10);
        const to = parseInt(imeiTo, 10);
        if (isNaN(from) || isNaN(to)) {
            console.error(`Invalid IMEI range: imeiFrom=${imeiFrom}, imeiTo=${imeiTo}`);
            return 0;
        }
        return to - from + 1;
    }
};
exports.ProductAssignAdapter = ProductAssignAdapter;
exports.ProductAssignAdapter = ProductAssignAdapter = __decorate([
    (0, common_1.Injectable)()
], ProductAssignAdapter);
//# sourceMappingURL=product-assign.adapter.js.map