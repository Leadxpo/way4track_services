import { BaseEntity } from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { AttendanceEntity } from 'src/attendence/entity/attendence.entity';
export declare enum DesignationEnum {
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
export declare class StaffEntity extends BaseEntity {
    id: number;
    name: string;
    phoneNumber: string;
    staffId: string;
    password: string;
    staffPhoto: string;
    designation: DesignationEnum;
    dob: Date;
    email: string;
    aadharNumber: string;
    address: string;
    joiningDate: Date;
    beforeExperience: number;
    basicSalary: number;
    branch: BranchEntity;
    appointment: AppointmentEntity[];
    attendance: AttendanceEntity[];
    workAllocation: WorkAllocationEntity[];
    productAssign: ProductAssignEntity[];
    request: RequestRaiseEntity[];
    tickets: TicketsEntity[];
    companyCode: string;
    unitCode: string;
}
