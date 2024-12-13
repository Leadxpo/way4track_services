import { AddressingDepartment } from "../enum/tickets.enum";

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
    }
}