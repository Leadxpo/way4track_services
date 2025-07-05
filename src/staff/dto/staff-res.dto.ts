import { AccountType, Gender, YesNo } from "../entity/staff.entity";
import { AttendanceStatus } from "../enum/attendence-status.enum";
import { Qualification } from "../enum/qualifications.enum";
import { StaffStatus } from "../enum/staff-status";
import { Experience } from "./staff.dto";

export class GetStaffResDto {
    id: number;
    name: string;
    phoneNumber: string;
    alternateNumber?: string;
    designation: string;
    staffId: string;
    password?: string;
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
    branchId: number;
    branchName?: string
    accountType: AccountType;
    department?: string;
    monthlySalary?: number;
    salaryDate?: Date;
    // salaryStatus: SalaryStatus;
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
    // attendance?: AttendanceStatus;
    qualifications?: Qualifications[];
    // branch: number;
    officePhoneNumber?: string;
    officeEmail?: string;
    mailAllocation?: YesNo;
    carryForwardLeaves?: number;
    staffStatus?: StaffStatus;
    accountBranch?: string;
    uniqueId?: string;
    experienceDetails?: Experience[]

    constructor(
        id: number,
        name: string,
        phoneNumber: string,
        alternateNumber: string | undefined,
        designation: string,
        staffId: string,
        password: string | undefined,
        staffPhoto: string | undefined,
        gender: Gender,
        location: string | undefined,
        dob: Date,
        email: string,
        aadharNumber: string,
        panCardNumber: string | undefined,
        drivingLicence: YesNo,
        drivingLicenceNumber: string | undefined,
        uanNumber: string | undefined,
        esicNumber: string | undefined,
        bloodGroup: string | undefined,
        joiningDate: string,
        beforeExperience: number,
        // previousCompany: string | undefined,
        // previousDesignation: string | undefined,
        // totalExperience: number | undefined,
        // previousSalary: number | undefined,
        bankName: string | undefined,
        accountNumber: string | undefined,
        ifscCode: string | undefined,
        address: string,
        branchId: number,
        branchName: string,
        accountType: AccountType,
        department: string | undefined,
        monthlySalary: number | undefined,
        salaryDate: Date | undefined,
        // salaryStatus: SalaryStatus,
        bikeAllocation: YesNo,
        vehiclePhoto: string | undefined,
        bikeNumber: string | undefined,
        mobileAllocation: YesNo,
        mobileBrand: string | undefined,
        mobileNumber: string | undefined,
        imeiNumber: string | undefined,
        terminationDate: Date | undefined,
        resignationDate: Date | undefined,
        finalSettlementDate: Date | undefined,
        insuranceNumber: string | undefined,
        insuranceEligibilityDate: Date | undefined,
        insuranceExpiryDate: Date | undefined,
        description: string | undefined,
        companyCode: string,
        unitCode: string,
        latitude: string | undefined,
        longitude: string | undefined,
        createdAt: Date | undefined,
        updatedAt: Date | undefined,
        // attendance: AttendanceStatus | undefined,
        qualifications: Qualifications[] | undefined,
        officePhoneNumber?: string,
        officeEmail?: string,
        mailAllocation?: YesNo,
        carryForwardLeaves?: number,
        staffStatus?: StaffStatus,
        accountBranch?: string | undefined,
        uniqueId?: string,
        experienceDetails?: Experience[]




        // branch: number
    ) {
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
        // this.attendance = attendance;
        this.qualifications = qualifications;
        // this.branch = branch;
        this.officeEmail = officeEmail
        this.officePhoneNumber = officePhoneNumber
        this.mailAllocation = mailAllocation
        this.carryForwardLeaves = carryForwardLeaves
        this.staffStatus = staffStatus
        this.branchName = branchName
        this.uniqueId = uniqueId
        this.experienceDetails = experienceDetails
    }
}

export class Qualifications {
    qualificationName: string;
    marksOrCgpa: number;
    file?: string;

    constructor(qualificationName: string, marksOrCgpa: number, file?: string) {
        this.qualificationName = qualificationName;
        this.marksOrCgpa = marksOrCgpa;
        this.file = file;
    }
}
