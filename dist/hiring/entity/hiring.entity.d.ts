import { BaseEntity } from 'typeorm';
import { HiringStatus } from '../enum/hiring-status.enum';
import { HiringLevel } from '../enum/hiring-level.enum';
import { YesNo } from 'src/staff/entity/staff.entity';
export declare enum InterviewWith {
    Sunil = "Sunil",
    Ashok = "Ashok",
    HR = "HR"
}
export declare class HiringEntity extends BaseEntity {
    id: number;
    hiringLevel: HiringLevel;
    candidateName: string;
    phoneNumber: string;
    email: string;
    address: string;
    qualifications: {
        qualificationName: string;
        marks: number;
        yearOfPass: number;
    }[];
    levelWiseData: {
        dateOfConductor: string;
        conductorBy: InterviewWith.HR;
        conductorPlace: string;
        result: string;
        review: string;
        type?: string;
    }[];
    resumePath: string;
    joiningDate: string;
    noticePeriod: string;
    dateOfUpload: Date;
    status: HiringStatus;
    companyCode: string;
    unitCode: string;
    createdAt: Date;
    updatedAt: Date;
    drivingLicenceNumber: string;
    drivingLicence: YesNo;
}
