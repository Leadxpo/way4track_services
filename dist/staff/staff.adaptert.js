"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffAdapter = void 0;
const common_1 = require("@nestjs/common");
const staff_entity_1 = require("./entity/staff.entity");
const staff_res_dto_1 = require("./dto/staff-res.dto");
const branch_entity_1 = require("../branch/entity/branch.entity");
let StaffAdapter = class StaffAdapter {
    convertDtoToEntity(dto) {
        const entity = new staff_entity_1.StaffEntity();
        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        entity.staffPhoto = dto.staffPhoto;
        entity.designation = dto.designation;
        entity.dob = dto.dob;
        entity.email = dto.email;
        entity.aadharNumber = dto.aadharNumber;
        entity.address = dto.address;
        entity.joiningDate = dto.joiningDate;
        entity.basicSalary = dto.basicSalary;
        const branchEntity = new branch_entity_1.BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branch = branchEntity;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.password = dto.password;
        entity.beforeExperience = dto.beforeExperience;
        if (dto.id) {
            entity.id = dto.id;
        }
        if (dto.staffId) {
            entity.staffId = dto.staffId;
        }
        return entity;
    }
    convertEntityToDto(entity) {
        return entity.map((staffMember) => {
            return new staff_res_dto_1.GetStaffResDto(staffMember.id, staffMember.name, staffMember.phoneNumber, staffMember.staffId, staffMember.designation, staffMember?.branch?.id, staffMember?.branch?.branchName, staffMember.dob, staffMember.email, staffMember.aadharNumber, staffMember.address, staffMember.joiningDate, staffMember.basicSalary, staffMember.beforeExperience, staffMember.staffPhoto, staffMember.companyCode, staffMember.unitCode);
        });
    }
};
exports.StaffAdapter = StaffAdapter;
exports.StaffAdapter = StaffAdapter = __decorate([
    (0, common_1.Injectable)()
], StaffAdapter);
//# sourceMappingURL=staff.adaptert.js.map