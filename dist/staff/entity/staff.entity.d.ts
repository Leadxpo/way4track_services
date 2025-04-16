import { BranchEntity } from 'src/branch/entity/branch.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { AttendanceEntity } from 'src/attendence/entity/attendence.entity';
import { NotificationEntity } from 'src/notifications/entity/notification.entity';
import { PermissionEntity } from 'src/permissions/entity/permissions.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { BaseEntity } from 'typeorm';
import { LettersEntity } from '../../letters/entity/letters.entity';
import { DispatchEntity } from 'src/dispatch/entity/dispatch.entity';
import { DesignationEntity } from 'src/designation/entity/designation.entity';
import { StaffStatus } from '../enum/staff-status';
import { Experience } from '../dto/staff.dto';
import { ProductEntity } from 'src/product/entity/product.entity';
export declare enum Gender {
    MALE = "Male",
    FEMALE = "Female"
}
export declare enum YesNo {
    YES = "Yes",
    NO = "No"
}
export declare enum Qualification {
    TENTH = "10th Class",
    INTERMEDIATE = "Intermediate",
    DEGREE = "Degree",
    POST_GRADUATION = "Post Graduation",
    ITIORDiploma = "ITI / Diploma"
}
export declare enum AccountType {
    SAVINGS = "savings",
    CURRENT = "current"
}
export declare class StaffEntity extends BaseEntity {
    id: number;
    name: string;
    phoneNumber: string;
    officePhoneNumber: string;
    alternateNumber: string;
    staffId: string;
    password: string;
    staffPhoto: string;
    resume: string;
    gender: Gender;
    location: string;
    dob: Date;
    email: string;
    officeEmail: string;
    aadharNumber: string;
    panCardNumber: string;
    drivingLicence: YesNo;
    drivingLicenceNumber: string;
    uanNumber: string;
    esicNumber: string;
    bloodGroup: string;
    joiningDate: string;
    beforeExperience: number;
    bankName: string;
    accountNumber: string;
    accountBranch: string;
    ifscCode: string;
    address: string;
    branchName: string;
    accountType: AccountType;
    department: string;
    monthlySalary: number;
    salaryDate: Date;
    status: StaffStatus;
    bikeAllocation: YesNo;
    vehiclePhoto: string;
    bikeNumber: string;
    mobileAllocation: YesNo;
    mailAllocation: YesNo;
    mobileBrand: string;
    mobileNumber: string;
    imeiNumber: string;
    terminationDate: Date;
    resignationDate: Date;
    finalSettlementDate: Date;
    insuranceNumber: string;
    insuranceEligibilityDate: Date;
    insuranceExpiryDate: Date;
    description: string;
    companyCode: string;
    uniqueId: string;
    unitCode: string;
    latitude: string;
    longitude: string;
    createdAt: Date;
    updatedAt: Date;
    qualifications: {
        qualificationName: Qualification;
        marksOrCgpa: number;
        file?: string;
    }[];
    branch: BranchEntity;
    appointment: AppointmentEntity[];
    technician: TechnicianWorksEntity[];
    permissions: PermissionEntity[];
    dispatch: DispatchEntity[];
    notifications: NotificationEntity[];
    attendance: AttendanceEntity[];
    workAllocation: WorkAllocationEntity[];
    sales: WorkAllocationEntity[];
    productAssign: ProductAssignEntity[];
    voucherId: VoucherEntity[];
    voucher: VoucherEntity[];
    staffFrom: RequestRaiseEntity[];
    staffTo: RequestRaiseEntity[];
    request: RequestRaiseEntity[];
    tickets: TicketsEntity[];
    Letters: LettersEntity[];
    designation: string;
    designationRelation: DesignationEntity;
    carryForwardLeaves: number;
    experienceDetails: Experience[];
    product: ProductEntity[];
}
