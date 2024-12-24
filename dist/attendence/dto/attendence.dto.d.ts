import { AttendanceStatus } from "src/staff/enum/attendence-status.enum";
export declare class CreateAttendanceDto {
    id: number;
    staffId: number;
    branchId: number;
    day: Date;
    companyCode: string;
    unitCode: string;
    inTime?: Date;
    outTime?: Date;
    status: AttendanceStatus;
    remarks?: string;
}
export declare class GetAttendanceDto {
    staffId: number;
    branchId: number;
    day: Date;
    inTime: Date;
    outTime: Date;
    status: AttendanceStatus;
    staffName: string;
    branchName: string;
    companyCode: string;
    unitCode: string;
}