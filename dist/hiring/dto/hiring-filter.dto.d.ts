import { HiringStatus } from "../enum/hiring-status.enum";
export declare class HiringFilterDto {
    hiringId?: number;
    candidateName?: string;
    status?: HiringStatus;
    companyCode: string;
    unitCode: string;
}
