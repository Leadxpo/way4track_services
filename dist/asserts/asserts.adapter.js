"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertsAdapter = void 0;
const common_1 = require("@nestjs/common");
const voucher_repo_1 = require("../voucher/repo/voucher.repo");
const get_asserts_res_dto_1 = require("./dto/get-asserts-res.dto");
const asserts_entity_1 = require("./entity/asserts-entity");
const branch_repo_1 = require("../branch/repo/branch.repo");
let AssertsAdapter = class AssertsAdapter {
    constructor(voucherRepository, branchRepository) {
        this.voucherRepository = voucherRepository;
        this.branchRepository = branchRepository;
    }
    convertEntityToDto(entity) {
        return new get_asserts_res_dto_1.GetAssertsResDto(entity.id, entity.branchId?.id || 0, entity.branchId?.branchName || '', entity.assertsName || '', entity.assertsAmount || 0, entity.assetType, entity.assertsAmount || 0, entity.quantity || 0, entity.description || '', entity.purchaseDate || new Date(), entity.assetPhoto || '', entity.paymentType, entity.companyCode, entity.unitCode);
    }
    async convertDtoToEntity(dto) {
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
        if (dto.branchId) {
            const branchEntity = await this.branchRepository.findOne({ where: { id: dto.branchId } });
            if (!branchEntity) {
                throw new Error(`Branch with ID ${dto.branchId} not found`);
            }
            entity.branchId = branchEntity;
        }
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
};
exports.AssertsAdapter = AssertsAdapter;
exports.AssertsAdapter = AssertsAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [voucher_repo_1.VoucherRepository,
        branch_repo_1.BranchRepository])
], AssertsAdapter);
//# sourceMappingURL=asserts.adapter.js.map