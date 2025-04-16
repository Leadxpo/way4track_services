import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { AddressingDepartment } from "../entity/tickets.entity";
export declare class GetTicketsResDto {
    staffId: number;
    staffName: string;
    staffNumber: string;
    problem: string;
    date: Date;
    branchId: number;
    branchName: string;
    ticketNumber: string;
    addressingDepartment: AddressingDepartment;
    companyCode: string;
    unitCOde: string;
    workStatus?: WorkStatusEnum;
    description?: string;
    subDealerId?: number;
    designationRelation?: number;
    constructor(staffId: number, staffName: string, staffNumber: string, problem: string, date: Date, branchId: number, branchName: string, ticketNumber: string, addressingDepartment: AddressingDepartment, companyCode: string, unitCOde: string, workStatus?: WorkStatusEnum, description?: string, subDealerId?: number, designationRelation?: number);
}
