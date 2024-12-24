"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiringAdapter = void 0;
const common_1 = require("@nestjs/common");
const hiring_entity_1 = require("./entity/hiring.entity");
let HiringAdapter = class HiringAdapter {
    convertDtoToEntity(dto) {
        const entity = new hiring_entity_1.HiringEntity();
        entity.hiringLevel = dto.hiringLevel;
        entity.candidateName = dto.candidateName;
        entity.phoneNumber = dto.phoneNumber;
        entity.email = dto.email;
        entity.address = dto.address;
        entity.qualifications = dto.qualifications;
        entity.resumePath = dto.resumePath;
        entity.dateOfUpload = dto.dateOfUpload;
        entity.status = dto.status;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        return entity;
    }
};
exports.HiringAdapter = HiringAdapter;
exports.HiringAdapter = HiringAdapter = __decorate([
    (0, common_1.Injectable)()
], HiringAdapter);
//# sourceMappingURL=hiring.adapter.js.map