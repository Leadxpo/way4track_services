"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateAdapter = void 0;
const common_1 = require("@nestjs/common");
const client_entity_1 = require("../client/entity/client.entity");
const estimate_res_dto_1 = require("./dto/estimate-res.dto");
const estimate_entity_1 = require("./entity/estimate.entity");
const vendor_entity_1 = require("../vendor/entity/vendor.entity");
let EstimateAdapter = class EstimateAdapter {
    convertDtoToEntity(dto) {
        const entity = new estimate_entity_1.EstimateEntity();
        entity.id = dto.id;
        entity.buildingAddress = dto.buildingAddress;
        entity.estimateDate = dto.estimateDate;
        entity.expireDate = dto.expireDate;
        entity.productOrService = dto.productOrService;
        entity.description = dto.description;
        entity.amount = dto.totalAmount;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        const clientEntity = new client_entity_1.ClientEntity();
        clientEntity.clientId = dto.clientId;
        entity.clientId = clientEntity;
        entity.quantity = dto.quantity;
        const vendorEntity = new vendor_entity_1.VendorEntity();
        vendorEntity.id = dto.vendorId;
        entity.vendorId = vendorEntity;
        entity.quantity = dto.quantity;
        if (dto.SCST)
            entity.SCST = dto.SCST;
        if (dto.CGST)
            entity.CGST = dto.CGST;
        entity.estimatePdfUrl = dto.estimatePdfUrl;
        entity.invoicePdfUrl = dto.invoicePdfUrl;
        if (!dto.productDetails || dto.productDetails.length === 0) {
            entity.productDetails = [];
        }
        else {
            entity.productDetails = Array.isArray(dto.productDetails)
                ? dto.productDetails.map((productDetail) => ({
                    type: productDetail.type,
                    productId: productDetail.productId,
                    productName: productDetail.productName,
                    quantity: productDetail.quantity,
                    costPerUnit: productDetail.costPerUnit,
                    totalCost: productDetail.totalCost,
                    hsnCode: productDetail.hsnCode
                }))
                : [];
        }
        return entity;
    }
    convertEntityToResDto(entities) {
        return entities.map(entity => new estimate_res_dto_1.EstimateResDto(entity.id, entity.clientId ? entity.clientId.clientId : null, entity.clientId ? entity.clientId.name : '', entity.clientId ? entity.clientId.address : '', entity.clientId ? entity.clientId.email : '', entity.clientId ? entity.clientId.phoneNumber : '', entity.buildingAddress, entity.estimateDate, entity.expireDate, entity.productOrService, entity.description, entity.amount, entity.companyCode, entity.unitCode, entity.productDetails?.map(product => ({
            type: product.type,
            productId: product.productId,
            name: product.productName,
            quantity: product.quantity,
            costPerUnit: product.costPerUnit,
            totalCost: product.totalCost,
            hsnCode: product.hsnCode
        })) ?? [], entity.estimateId, entity.invoiceId, entity.SCST, entity.CGST, entity.vendorId ? entity.vendorId.id : null, entity.vendorId ? entity.vendorId.name : null, entity.vendorId ? entity.vendorId.vendorPhoneNumber : null, entity.estimatePdfUrl, entity.invoicePdfUrl));
    }
};
exports.EstimateAdapter = EstimateAdapter;
exports.EstimateAdapter = EstimateAdapter = __decorate([
    (0, common_1.Injectable)()
], EstimateAdapter);
//# sourceMappingURL=estimate.adapter.js.map