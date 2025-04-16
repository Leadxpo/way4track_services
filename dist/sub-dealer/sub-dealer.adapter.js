"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubDealerAdapter = void 0;
const common_1 = require("@nestjs/common");
const sub_dealer_entity_1 = require("./entity/sub-dealer.entity");
const sub_dealer_res_dto_1 = require("./dto/sub-dealer-res.dto");
const branch_entity_1 = require("../branch/entity/branch.entity");
let SubDealerAdapter = class SubDealerAdapter {
    convertDtoToEntity(dto) {
        const entity = new sub_dealer_entity_1.SubDealerEntity();
        entity.name = dto.name;
        entity.subDealerPhoneNumber = dto.subDealerPhoneNumber;
        entity.alternatePhoneNumber = dto.alternatePhoneNumber;
        entity.gstNumber = dto.gstNumber;
        entity.startingDate = dto.startingDate;
        entity.emailId = dto.emailId;
        entity.aadharNumber = dto.aadharNumber;
        entity.address = dto.address;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.password = dto.password;
        entity.subDealerPhoto = dto.subDealerPhoto;
        if (dto.branchId) {
            const branch = new branch_entity_1.BranchEntity();
            branch.id = dto.branchId;
            entity.branch = branch;
        }
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
    convertEntityToDto(entity) {
        return entity.map((subDealer) => {
            const { id, name, subDealerPhoneNumber, alternatePhoneNumber, startingDate, emailId, aadharNumber, address, password, subDealerPhoto, subDealerId, companyCode, unitCode, branch } = subDealer;
            return new sub_dealer_res_dto_1.SubDealerResDto(id, name, subDealerPhoneNumber, alternatePhoneNumber, startingDate, emailId, aadharNumber, address, password, subDealerPhoto, subDealerId, companyCode, unitCode, branch?.id ?? null, branch?.branchName ?? '');
        });
    }
};
exports.SubDealerAdapter = SubDealerAdapter;
exports.SubDealerAdapter = SubDealerAdapter = __decorate([
    (0, common_1.Injectable)()
], SubDealerAdapter);
//# sourceMappingURL=sub-dealer.adapter.js.map