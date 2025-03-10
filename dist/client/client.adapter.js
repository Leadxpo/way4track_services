"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAdapter = void 0;
const common_1 = require("@nestjs/common");
const client_entity_1 = require("./entity/client.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
const client_res_dto_1 = require("./dto/client-res.dto");
const voucher_entity_1 = require("../voucher/entity/voucher.entity");
let ClientAdapter = class ClientAdapter {
    convertDtoToEntity(dto) {
        const entity = new client_entity_1.ClientEntity();
        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        const branchEntity = new branch_entity_1.BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branch = branchEntity;
        entity.clientPhoto = dto.clientPhoto;
        entity.dob = dto.dob;
        entity.email = dto.email;
        entity.address = dto.address;
        entity.joiningDate = dto.joiningDate;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        const voucherEntity = new voucher_entity_1.VoucherEntity();
        voucherEntity.id = dto.voucherId;
        entity.voucherId = voucherEntity;
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
    convertEntityToDto(entity) {
        return entity.map((client) => {
            return new client_res_dto_1.ClientResDto(client.id, client.name, client.phoneNumber, client.clientId, client.clientPhoto, client?.branch?.id, client?.branch?.branchName, client.dob, client.email, client.address, client.joiningDate, client?.voucherId?.voucherId, client.companyCode, client.unitCode);
        });
    }
};
exports.ClientAdapter = ClientAdapter;
exports.ClientAdapter = ClientAdapter = __decorate([
    (0, common_1.Injectable)()
], ClientAdapter);
//# sourceMappingURL=client.adapter.js.map