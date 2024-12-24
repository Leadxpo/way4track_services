import { AttendanceStatus } from "../enum/attendence-status.enum";

export class AttendanceDto {
    day: Date;
    inTime: Date;
    outTime: Date;
    status: AttendanceStatus;
}
