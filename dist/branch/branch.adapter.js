"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchAdapter = void 0;
const common_1 = require("@nestjs/common");
const branch_entity_1 = require("./entity/branch.entity");
let BranchAdapter = class BranchAdapter {
    convertBranchDtoToEntity(dto) {
        const entity = new branch_entity_1.BranchEntity();
        entity.branchName = dto.branchName;
        entity.branchNumber = dto.branchNumber;
        entity.branchAddress = dto.branchAddress;
        entity.addressLine1 = dto.addressLine1;
        entity.addressLine2 = dto.addressLine2;
        entity.city = dto.city;
        entity.state = dto.state;
        entity.pincode = dto.pincode;
        entity.branchOpening = dto.branchOpening;
        entity.email = dto.email;
        entity.branchPhoto = dto.branchPhoto;
        entity.qrPhoto = dto.qrPhoto;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.latitude = dto.latitude;
        entity.longitude = dto.longitude;
        entity.GST = dto.GST;
        entity.CIN = dto.CIN;
        if (entity.id) {
            entity.id = dto.id;
        }
        return entity;
    }
};
exports.BranchAdapter = BranchAdapter;
exports.BranchAdapter = BranchAdapter = __decorate([
    (0, common_1.Injectable)()
], BranchAdapter);
//# sourceMappingURL=branch.adapter.js.map