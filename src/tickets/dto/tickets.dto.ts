import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { AddressingDepartment } from "../entity/tickets.entity";

export class TicketsDto {
    id?: number;
    staffId: number;
    problem: string;
    date: Date;
    branchId: number;
    addressingDepartment: AddressingDepartment;
    companyCode: string;
    unitCode: string;
    workStatus: WorkStatusEnum;
    description: string;
}
