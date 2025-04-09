import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { AddressingDepartment } from "../entity/tickets.entity";

export class GetTicketsResDto {
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
    subDealerId?: number
    constructor(
        staffId: number,
        staffName: string,
        staffNumber: string,
        problem: string,
        date: Date,
        branchId: number,
        branchName: string,
        ticketNumber: string,
        addressingDepartment: AddressingDepartment,
        companyCode: string,
        unitCOde: string,
        workStatus?: WorkStatusEnum,
        description?: string,
        subDealerId?: number

    ) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.staffNumber = staffNumber;
        this.problem = problem;
        this.date = date;
        this.branchId = branchId;
        this.branchName = branchName;
        this.ticketNumber = ticketNumber;
        this.addressingDepartment = addressingDepartment;
        this.companyCode = companyCode;
        this.unitCOde = unitCOde
        this.workStatus = workStatus
        this.description = description
        this.subDealerId = subDealerId
    }
}
