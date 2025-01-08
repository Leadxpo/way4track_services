import { DesignationEnum } from "src/staff/entity/staff.entity";
import { HiringLevel } from "../enum/hiring-level.enum";
import { HiringStatus } from "../enum/hiring-status.enum";

export class HiringDto {
    id?: number;
    hiringLevel: HiringLevel;
    candidateName: string;
    phoneNumber: string;
    email: string;
    address: string;
    qualifications: { qualificationName: string; marks: number; yearOfPass: number }[];
    levelWiseData: {
        dateOfConductor: number,
        conductorBy: DesignationEnum.HR,
        conductorPlace: string,
        result: string,
        review: string,
    }[];
    resumePath?: string;
    dateOfUpload: Date;
    status: HiringStatus
    companyCode: string;
    unitCode: string
}
