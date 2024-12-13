import { AttendanceStatus } from "src/staff/enum/attendence-status.enum";

export class CreateAttendanceDto {
    id: number;
    staffId: number;
    branchId: number;
    day: Date;
    inTime?: Date;
    outTime?: Date;
    status: AttendanceStatus;
    remarks?: string;
}


export class GetAttendanceDto {
    staffId: number;
    branchId: number;
    day: Date;
    inTime: Date;
    outTime: Date;
    status: AttendanceStatus;
    staffName: string;
    branchName: string;
}
