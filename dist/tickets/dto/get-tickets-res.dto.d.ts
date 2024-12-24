import { AddressingDepartment } from "../enum/tickets.enum";
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
    constructor(staffId: number, staffName: string, staffNumber: string, problem: string, date: Date, branchId: number, branchName: string, ticketNumber: string, addressingDepartment: AddressingDepartment, companyCode: string, unitCOde: string);
}
