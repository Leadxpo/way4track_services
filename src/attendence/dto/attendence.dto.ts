import { AttendanceStatus } from "src/staff/enum/attendence-status.enum";

export class CreateAttendanceDto {
    id: number;
    staffId: string;
    day: Date;
    branchName: string
    inTime?: string;
    outTime?: string;
    inTimeRemark?: string;
    staffName?: string;
    outTimeRemark?: string;
    status: AttendanceStatus;
    remarks?: string;
}


export class GetAttendanceDto {
    staffId: string;
    day: Date;
    inTime: string;
    inTimeRemark?: string;
    outTime: string;
    outTimeRemark?: string;
    status: AttendanceStatus;
    staffName: string;
    branchName: string;
}
