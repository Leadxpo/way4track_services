"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertsAdapter = void 0;
const common_1 = require("@nestjs/common");
const asserts_entity_1 = require("./entity/asserts-entity");
const get_asserts_res_dto_1 = require("./dto/get-asserts-res.dto");
const voucher_entity_1 = require("../voucher/entity/voucher.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
let AssertsAdapter = class AssertsAdapter {
    convertEntityToDto(entity) {
        return new get_asserts_res_dto_1.GetAssertsResDto(entity.id, entity.branchId?.id || 0, entity.branchId?.branchName || '', entity.assertsName || '', entity.assertsAmount || 0, entity.assetType, entity.assertsAmount || 0, entity.quantity || 0, entity.description || '', entity.purchaseDate || new Date(), entity.assetPhoto || '', entity.voucherId?.id || null, entity.voucherId?.voucherId || '', entity.paymentType, entity.companyCode, entity.unitCode, entity.initialPayment, entity.numberOfEmi, entity.emiNumber, entity.emiAmount);
    }
    convertDtoToEntity(dto) {
        const entity = new asserts_entity_1.AssertsEntity();
        entity.assertsName = dto.assertsName;
        entity.assetPhoto = dto.assetPhoto;
        entity.assertsAmount = dto.assertsAmount;
        entity.assetType = dto.assetType;
        entity.quantity = dto.quantity;
        entity.description = dto.description;
        entity.purchaseDate = dto.purchaseDate;
        entity.paymentType = dto.paymentType;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        const branchEntity = new branch_entity_1.BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branchId = branchEntity;
        const voucherEntity = new voucher_entity_1.VoucherEntity();
        voucherEntity.id = dto.voucherId;
        entity.voucherId = voucherEntity;
        if (dto.id) {
            entity.id = dto.id;
        }
        if (dto.initialPayment) {
            entity.initialPayment = dto.initialPayment;
        }
        if (dto.numberOfEmi) {
            entity.numberOfEmi = dto.numberOfEmi;
        }
        if (dto.emiNumber) {
            entity.emiNumber = dto.emiNumber;
        }
        if (dto.emiAmount) {
            entity.emiAmount = dto.emiAmount;
        }
        return entity;
    }
};
exports.AssertsAdapter = AssertsAdapter;
exports.AssertsAdapter = AssertsAdapter = __decorate([
    (0, common_1.Injectable)()
], AssertsAdapter);
//# sourceMappingURL=asserts.adapter.js.map