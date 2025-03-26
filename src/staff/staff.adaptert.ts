import { Injectable } from '@nestjs/common';
import { StaffEntity } from './entity/staff.entity';
import { StaffDto } from './dto/staff.dto';
import { GetStaffResDto } from './dto/staff-res.dto';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceEntity } from 'src/attendence/entity/attendence.entity';
import { DesignationEntity } from 'src/designation/entity/designation.entity';

@Injectable()
export class StaffAdapter {
    convertDtoToEntity(dto: StaffDto): StaffEntity {
        const entity = new StaffEntity();

        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        entity.alternateNumber = dto.alternateNumber;
        entity.staffPhoto = dto.staffPhoto;
        entity.designation = dto.designation; // Assigning designation name
        // const des=new DesignationEntity()
        // des.designation=dto.designation
        // entity.designation =des;
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
        // entity.previousCompany = dto.previousCompany;
        // entity.previousDesignation = dto.previousDesignation;
        // entity.totalExperience = dto.totalExperience;
        // entity.previousSalary = dto.previousSalary;
        entity.bankName = dto.bankName;
        entity.accountNumber = dto.accountNumber;
        entity.ifscCode = dto.ifscCode;
        entity.address = dto.address;
        entity.accountType = dto.accountType;
        entity.department = dto.department;
        entity.monthlySalary = dto.monthlySalary;
        entity.salaryDate = dto.salaryDate;
        // entity.salaryStatus = dto.salaryStatus;
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
        entity.qualifications = dto.qualifications
        entity.mailAllocation = dto.mailAllocation
        entity.officeEmail = dto.officeEmail
        entity.officePhoneNumber = dto.officePhoneNumber
        entity.carryForwardLeaves = dto.carryForwardLeaves
        entity.status = dto.staffStatus
        entity.accountBranch = dto.accountBranch
        if (dto.id) {
            entity.id = dto.id;
        }

        if (dto.branch) {
            const branchEntity = new BranchEntity();
            branchEntity.id = dto.branch;
            entity.branch = branchEntity;
            entity.branchName = branchEntity.branchName;

        }
        entity.experienceDetails = dto.experienceDetails
        return entity;
    }





    convertEntityToDto(entity: StaffEntity[]): GetStaffResDto[] {
        return entity.map((staffMember) => {
            return new GetStaffResDto(
                staffMember.id,
                staffMember.name,
                staffMember.phoneNumber,
                staffMember.alternateNumber,
                staffMember.designation,
                staffMember.staffId,
                staffMember.password,
                staffMember.staffPhoto,
                staffMember.gender,
                staffMember.location,
                staffMember.dob,
                staffMember.email,
                staffMember.aadharNumber,
                staffMember.panCardNumber,
                staffMember.drivingLicence,
                staffMember.drivingLicenceNumber,
                staffMember.uanNumber,
                staffMember.esicNumber,
                staffMember.bloodGroup,
                staffMember.joiningDate,
                staffMember.beforeExperience,
                // staffMember.previousCompany,
                // staffMember.previousDesignation,
                // staffMember.totalExperience,
                // staffMember.previousSalary,
                staffMember.bankName,
                staffMember.accountNumber,
                staffMember.ifscCode,
                staffMember.address,
                staffMember.branch ? staffMember.branch.id : null, // ✅ Handle null branch
                staffMember.branch ? staffMember.branch.branchName : null,
                staffMember.accountType,
                staffMember.department,
                staffMember.monthlySalary,
                staffMember.salaryDate,
                // staffMember.salaryStatus,
                staffMember.bikeAllocation,
                staffMember.vehiclePhoto,
                staffMember.bikeNumber,
                staffMember.mobileAllocation,
                staffMember.mobileBrand,
                staffMember.mobileNumber,
                staffMember.imeiNumber,
                staffMember.terminationDate,
                staffMember.resignationDate,
                staffMember.finalSettlementDate,
                staffMember.insuranceNumber,
                staffMember.insuranceEligibilityDate,
                staffMember.insuranceExpiryDate,
                staffMember.description,
                staffMember.companyCode,
                staffMember.unitCode,
                staffMember.latitude,
                staffMember.longitude,
                staffMember.createdAt,
                staffMember.updatedAt,
                staffMember.qualifications,
                staffMember.officePhoneNumber,
                staffMember.officeEmail,
                staffMember.mailAllocation,
                staffMember.carryForwardLeaves,
                staffMember.status
            );
        });
    }

}
