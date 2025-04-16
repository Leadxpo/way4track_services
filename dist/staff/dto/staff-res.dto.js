"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qualifications = exports.GetStaffResDto = void 0;
class GetStaffResDto {
    constructor(id, name, phoneNumber, alternateNumber, designation, staffId, password, staffPhoto, gender, location, dob, email, aadharNumber, panCardNumber, drivingLicence, drivingLicenceNumber, uanNumber, esicNumber, bloodGroup, joiningDate, beforeExperience, bankName, accountNumber, ifscCode, address, branchId, branchName, accountType, department, monthlySalary, salaryDate, bikeAllocation, vehiclePhoto, bikeNumber, mobileAllocation, mobileBrand, mobileNumber, imeiNumber, terminationDate, resignationDate, finalSettlementDate, insuranceNumber, insuranceEligibilityDate, insuranceExpiryDate, description, companyCode, unitCode, latitude, longitude, createdAt, updatedAt, qualifications, officePhoneNumber, officeEmail, mailAllocation, carryForwardLeaves, staffStatus, accountBranch, uniqueId) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.alternateNumber = alternateNumber;
        this.designation = designation;
        this.staffId = staffId;
        this.password = password;
        this.staffPhoto = staffPhoto;
        this.gender = gender;
        this.location = location;
        this.dob = dob;
        this.email = email;
        this.aadharNumber = aadharNumber;
        this.panCardNumber = panCardNumber;
        this.drivingLicence = drivingLicence;
        this.drivingLicenceNumber = drivingLicenceNumber;
        this.uanNumber = uanNumber;
        this.esicNumber = esicNumber;
        this.bloodGroup = bloodGroup;
        this.joiningDate = joiningDate;
        this.beforeExperience = beforeExperience;
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.address = address;
        this.branchId = branchId;
        this.accountBranch = accountBranch;
        this.accountType = accountType;
        this.department = department;
        this.monthlySalary = monthlySalary;
        this.salaryDate = salaryDate;
        this.bikeAllocation = bikeAllocation;
        this.vehiclePhoto = vehiclePhoto;
        this.bikeNumber = bikeNumber;
        this.mobileAllocation = mobileAllocation;
        this.mobileBrand = mobileBrand;
        this.mobileNumber = mobileNumber;
        this.imeiNumber = imeiNumber;
        this.terminationDate = terminationDate;
        this.resignationDate = resignationDate;
        this.finalSettlementDate = finalSettlementDate;
        this.insuranceNumber = insuranceNumber;
        this.insuranceEligibilityDate = insuranceEligibilityDate;
        this.insuranceExpiryDate = insuranceExpiryDate;
        this.description = description;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.qualifications = qualifications;
        this.officeEmail = officeEmail;
        this.officePhoneNumber = officePhoneNumber;
        this.mailAllocation = mailAllocation;
        this.carryForwardLeaves = carryForwardLeaves;
        this.staffStatus = staffStatus;
        this.branchName = branchName;
        this.uniqueId = uniqueId;
    }
}
exports.GetStaffResDto = GetStaffResDto;
class Qualifications {
    constructor(qualificationName, marksOrCgpa, file) {
        this.qualificationName = qualificationName;
        this.marksOrCgpa = marksOrCgpa;
        this.file = file;
    }
}
exports.Qualifications = Qualifications;
//# sourceMappingURL=staff-res.dto.js.map