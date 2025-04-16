import { StaffEntity } from 'src/staff/entity/staff.entity';
import { AttendanceStatus } from 'src/staff/enum/attendence-status.enum';
export declare class AttendanceEntity {
    id: number;
    staff: StaffEntity;
    staffName: string;
    branchName: string;
    day: Date;
    inTime: string;
    inTimeRemark: string;
    outTime: string;
    outTimeRemark: string;
    remark: string;
    status: AttendanceStatus;
}
