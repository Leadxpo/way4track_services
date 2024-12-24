import { HiringStatus } from "../enum/hiring-status.enum";

export class HiringFilterDto {
    hiringId?: number; // Optional hiring id for filtering
    candidateName?: string; // Optional candidate name for filtering
    status?: HiringStatus; // Optional hiring status for filtering
    companyCode: string;
    unitCode: string
}
