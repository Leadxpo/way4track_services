import { AccountType, Gender, SalaryStatus, YesNo } from "../entity/staff.entity";
import { AttendanceStatus } from "../enum/attendence-status.enum";
import { Qualification } from "../enum/qualifications.enum";
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
    previousCompany?: string;
    previousDesignation?: string;
    totalExperience?: number;
    previousSalary?: number;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    address: string;
    branchName?: string;
    accountType: AccountType;
    department?: string;
    monthlySalary?: number;
    salaryDate?: Date;
    salaryStatus: SalaryStatus;
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

}

export class Qualifications {
    qualificationName: Qualification;
    marksOrCgpa: number;
    file?: string;
}