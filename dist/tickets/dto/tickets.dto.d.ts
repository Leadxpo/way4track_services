import { AddressingDepartment } from "../enum/tickets.enum";
export declare class TicketsDto {
    id?: number;
    staffId: number;
    problem: string;
    date: Date;
    branchId: number;
    addressingDepartment: AddressingDepartment;
    companyCode: string;
    unitCode: string;
}
