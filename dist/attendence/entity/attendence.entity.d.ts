import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceStatus } from 'src/staff/enum/attendence-status.enum';
export declare class AttendanceEntity {
    id: number;
    day: Date;
    inTime: Date;
    outTime: Date;
    status: AttendanceStatus;
    staffId: StaffEntity;
    branchId: BranchEntity;
    companyCode: string;
    unitCode: string;
}
