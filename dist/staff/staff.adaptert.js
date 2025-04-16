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
        entity.alternateNumber = dto.alternateNumber;
        entity.staffPhoto = dto.staffPhoto;
        entity.designation = dto.designation;
        entity.staffId = dto.staffId;
        entity.password = dto.password;
        entity.gender = dto.gender;
        entity.location = dto.location;
        entity.dob = dto.dob;
        entity.email = dto.email;
        entity.aadharNumber = dto.aadharNumber;
        entity.panCardNumber = dto.panCardNumber;
        entity.drivingLicence = dto.drivingLicence;
        entity.drivingLicenceNumber = dto.drivingLicenceNumber;
        entity.uanNumber = dto.uanNumber;
        entity.esicNumber = dto.esicNumber;
        entity.bloodGroup = dto.bloodGroup;
        entity.joiningDate = dto.joiningDate;
        entity.beforeExperience = dto.beforeExperience;
        entity.bankName = dto.bankName;
        entity.accountNumber = dto.accountNumber;
        entity.ifscCode = dto.ifscCode;
        entity.address = dto.address;
        entity.accountType = dto.accountType;
        entity.department = dto.department;
        entity.monthlySalary = dto.monthlySalary;
        entity.salaryDate = dto.salaryDate;
        entity.bikeAllocation = dto.bikeAllocation;
        entity.vehiclePhoto = dto.vehiclePhoto;
        entity.bikeNumber = dto.bikeNumber;
        entity.mobileAllocation = dto.mobileAllocation;
        entity.mobileBrand = dto.mobileBrand;
        entity.mobileNumber = dto.mobileNumber;
        entity.imeiNumber = dto.imeiNumber;
        entity.terminationDate = dto.terminationDate;
        entity.resignationDate = dto.resignationDate;
        entity.finalSettlementDate = dto.finalSettlementDate;
        entity.insuranceNumber = dto.insuranceNumber;
        entity.insuranceEligibilityDate = dto.insuranceEligibilityDate;
        entity.insuranceExpiryDate = dto.insuranceExpiryDate;
        entity.description = dto.description;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.latitude = dto.latitude;
        entity.longitude = dto.longitude;
        entity.qualifications = dto.qualifications;
        entity.mailAllocation = dto.mailAllocation;
        entity.officeEmail = dto.officeEmail;
        entity.officePhoneNumber = dto.officePhoneNumber;
        entity.carryForwardLeaves = dto.carryForwardLeaves;
        entity.status = dto.staffStatus;
        entity.accountBranch = dto.accountBranch;
        if (dto.id) {
            entity.id = dto.id;
        }
        if (dto.branch) {
            const branchEntity = new branch_entity_1.BranchEntity();
            branchEntity.id = dto.branch;
            entity.branch = branchEntity;
        }
        entity.experienceDetails = dto.experienceDetails;
        entity.branchName = dto.branchName;
        entity.uniqueId = dto.uniqueId;
        return entity;
    }
    convertEntityToDto(entity) {
        return entity.map((staffMember) => {
            return new staff_res_dto_1.GetStaffResDto(staffMember.id, staffMember.name, staffMember.phoneNumber, staffMember.alternateNumber, staffMember.designation, staffMember.staffId, staffMember.password, staffMember.staffPhoto, staffMember.gender, staffMember.location, staffMember.dob, staffMember.email, staffMember.aadharNumber, staffMember.panCardNumber, staffMember.drivingLicence, staffMember.drivingLicenceNumber, staffMember.uanNumber, staffMember.esicNumber, staffMember.bloodGroup, staffMember.joiningDate, staffMember.beforeExperience, staffMember.bankName, staffMember.accountNumber, staffMember.ifscCode, staffMember.address, staffMember.branch ? staffMember.branch.id : null, staffMember.branch ? staffMember.branch.branchName : null, staffMember.accountType, staffMember.department, staffMember.monthlySalary, staffMember.salaryDate, staffMember.bikeAllocation, staffMember.vehiclePhoto, staffMember.bikeNumber, staffMember.mobileAllocation, staffMember.mobileBrand, staffMember.mobileNumber, staffMember.imeiNumber, staffMember.terminationDate ? staffMember.terminationDate : null, staffMember.resignationDate ? staffMember.resignationDate : null, staffMember.finalSettlementDate ? staffMember.finalSettlementDate : null, staffMember.insuranceNumber, staffMember.insuranceEligibilityDate ? staffMember.insuranceEligibilityDate : null, staffMember.insuranceExpiryDate ? staffMember.insuranceExpiryDate : null, staffMember.description, staffMember.companyCode, staffMember.unitCode, staffMember.latitude, staffMember.longitude, staffMember.createdAt, staffMember.updatedAt, staffMember.qualifications, staffMember.officePhoneNumber, staffMember.officeEmail, staffMember.mailAllocation, staffMember.carryForwardLeaves, staffMember.status, staffMember.accountBranch ? staffMember.accountBranch : "", staffMember.uniqueId);
        });
    }
};
exports.StaffAdapter = StaffAdapter;
exports.StaffAdapter = StaffAdapter = __decorate([
    (0, common_1.Injectable)()
], StaffAdapter);
//# sourceMappingURL=staff.adaptert.js.map