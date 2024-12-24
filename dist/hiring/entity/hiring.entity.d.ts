import { BaseEntity } from 'typeorm';
import { HiringStatus } from '../enum/hiring-status.enum';
import { HiringLevel } from '../enum/hiring-level.enum';
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
    resumePath: string;
    dateOfUpload: Date;
    status: HiringStatus;
    companyCode: string;
    unitCode: string;
}
