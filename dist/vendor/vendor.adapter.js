"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorAdapter = void 0;
const common_1 = require("@nestjs/common");
const vendor_entity_1 = require("./entity/vendor.entity");
const vendor_res_dto_1 = require("./dto/vendor-res.dto");
const branch_entity_1 = require("../branch/entity/branch.entity");
let VendorAdapter = class VendorAdapter {
    convertDtoToEntity(dto) {
        const entity = new vendor_entity_1.VendorEntity();
        if (dto.id)
            entity.id = dto.id;
        entity.name = dto.name;
        entity.vendorPhoneNumber = dto.vendorPhoneNumber;
        entity.alternatePhoneNumber = dto.alternatePhoneNumber;
        entity.productType = dto.productType;
        entity.startingDate = dto.startingDate;
        entity.emailId = dto.emailId;
        entity.aadharNumber = dto.aadharNumber;
        entity.address = dto.address;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.vendorPhoto = dto.vendorPhoto;
        const branch = new branch_entity_1.BranchEntity();
        branch.id = dto.branchId;
        entity.branch = branch;
        return entity;
    }
    convertEntityToDto(entity) {
        return entity.map((vendor) => {
            const { id, name, vendorPhoneNumber, alternatePhoneNumber, productType, startingDate, emailId, aadharNumber, address, voucherId, companyCode, unitCode, vendorPhoto, } = vendor;
            return new vendor_res_dto_1.VendorResDto(id, name, vendorPhoneNumber, alternatePhoneNumber, productType, startingDate, emailId, aadharNumber, address, companyCode, unitCode, vendorPhoto, vendor.branch?.id, vendor.branch?.branchName);
        });
    }
};
exports.VendorAdapter = VendorAdapter;
exports.VendorAdapter = VendorAdapter = __decorate([
    (0, common_1.Injectable)()
], VendorAdapter);
//# sourceMappingURL=vendor.adapter.js.map