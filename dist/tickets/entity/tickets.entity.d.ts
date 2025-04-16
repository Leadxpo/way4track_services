import { BranchEntity } from 'src/branch/entity/branch.entity';
import { DesignationEntity } from 'src/designation/entity/designation.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { WorkStatusEnum } from 'src/work-allocation/enum/work-status-enum';
export declare enum AddressingDepartment {
    CEO = "CEO",
    HR = "HR",
    Accountant = "Accountant",
    Operator = "Operator",
    WarehouseManager = "Warehouse Manager",
    BranchManager = "Branch Manager",
    SubDealer = "Sub Dealer",
    Technician = "Technician",
    SalesMan = "Sales Man",
    CallCenter = "Call Center"
}
export declare class TicketsEntity {
    id: number;
    staff: StaffEntity;
    problem: string;
    date: Date;
    branch: BranchEntity;
    ticketNumber: string;
    description: string;
    workStatus: WorkStatusEnum;
    addressingDepartment: AddressingDepartment;
    companyCode: string;
    unitCode: string;
    createdAt: Date;
    updatedAt: Date;
    subDealerId: SubDealerEntity;
    designationRelation: DesignationEntity;
}
