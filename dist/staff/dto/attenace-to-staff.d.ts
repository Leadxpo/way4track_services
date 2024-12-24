import { AttendanceStatus } from "../enum/attendence-status.enum";
export declare class AttendanceDto {
    day: Date;
    inTime: Date;
    outTime: Date;
    status: AttendanceStatus;
}
