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
}
