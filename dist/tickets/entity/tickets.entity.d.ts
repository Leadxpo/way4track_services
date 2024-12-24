import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { AddressingDepartment } from '../enum/tickets.enum';
export declare class TicketsEntity {
    id: number;
    staff: StaffEntity;
    problem: string;
    date: Date;
    branch: BranchEntity;
    ticketNumber: string;
    addressingDepartment: AddressingDepartment;
    companyCode: string;
    unitCode: string;
}
