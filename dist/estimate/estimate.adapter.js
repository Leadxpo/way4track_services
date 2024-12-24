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
const estimate_res_dto_1 = require("./dto/estimate-res.dto");
const estimate_entity_1 = require("./entity/estimate.entity");
const client_entity_1 = require("../client/entity/client.entity");
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
        entity.products = dto.products;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        const clientEntity = new client_entity_1.ClientEntity();
        clientEntity.clientId = dto.clientId;
        entity.clientId = clientEntity;
        return entity;
    }
    convertEntityToResDto(entity) {
        const dto = new estimate_res_dto_1.EstimateResDto(entity.id, entity.clientId.clientId, entity.clientId.name, entity.clientId.address, entity.clientId.email, entity.clientId.phoneNumber, entity.buildingAddress, entity.estimateDate, entity.expireDate, entity.productOrService, entity.description, entity.amount, entity.companyCode, entity.unitCode, entity.products);
        return dto;
    }
};
exports.EstimateAdapter = EstimateAdapter;
exports.EstimateAdapter = EstimateAdapter = __decorate([
    (0, common_1.Injectable)()
], EstimateAdapter);
//# sourceMappingURL=estimate.adapter.js.map