import { AccountType, Gender, YesNo } from "../entity/staff.entity";
import { AttendanceStatus } from "../enum/attendence-status.enum";
import { Letters, Qualification } from "../enum/qualifications.enum";
import { StaffStatus } from "../enum/staff-status";
export class StaffDto {
    id?: number;
    name: string;
    phoneNumber: string;
    alternateNumber?: string;
    designation: string;
    staffId?: string;
    password: string;
    staffPhoto?: string;
    gender: Gender;
    location?: string;
    dob: Date;
    email: string;
    aadharNumber: string;
    panCardNumber?: string;
    drivingLicence: YesNo;
    drivingLicenceNumber?: string;
    uanNumber?: string;
    esicNumber?: string;
    bloodGroup?: string;
    joiningDate: string;
    beforeExperience: number;
    // previousCompany?: string;
    // previousDesignation?: string;
    // totalExperience?: number;
    // previousSalary?: number;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    address: string;
    branchName?: string;
    accountType: AccountType;
    department?: string;
    monthlySalary?: number;
    salaryDate?: Date;
    staffStatus: StaffStatus;
    bikeAllocation: YesNo;
    vehiclePhoto?: string;
    bikeNumber?: string;
    mobileAllocation: YesNo;
    mobileBrand?: string;
    mobileNumber?: string;
    imeiNumber?: string;
    terminationDate?: Date;
    resignationDate?: Date;
    finalSettlementDate?: Date;
    insuranceNumber?: string;
    insuranceEligibilityDate?: Date;
    insuranceExpiryDate?: Date;
    description?: string;
    companyCode: string;
    unitCode: string;
    latitude?: string;
    longitude?: string;
    createdAt?: Date;
    updatedAt?: Date;
    attendance?: AttendanceStatus;
    qualifications?: Qualifications[];
    branch: number
    officePhoneNumber: string;
    officeEmail: string;
    mailAllocation: YesNo;
    designation_id?: number
    carryForwardLeaves: number;
    experienceDetails?: Experience[]
    accountBranch?: string;

}

export class Qualifications {
    qualificationName: Qualification;
    marksOrCgpa: number;
    file?: string;
}

export class Experience {
    previousCompany: string;
    previous_designation: string;
    total_experience?: string;
    previous_salary?: string;
    letter?: Letters;
    uploadLetters?: string;
}

