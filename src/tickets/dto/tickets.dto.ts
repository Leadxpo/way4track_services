import { AddressingDepartment } from "../enum/tickets.enum";

export class TicketsDto {
    id?: number;
    staffId: number;
    problem: string;
    date: Date;
    branchId: number;
    addressingDepartment: AddressingDepartment;
}
