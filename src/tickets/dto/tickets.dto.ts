import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";

export class TicketsDto {
    id?: number;
    staffId: number;
    reportingStaffId: number;
    problem: string;
    remark: string;
    date: Date;
    branchId: number;
    companyCode: string;
    unitCode: string;
    workStatus: WorkStatusEnum;
    description: string;
    subDealerId?:number
    designationRelation?:number
    subDealerStaffId?:number
}
