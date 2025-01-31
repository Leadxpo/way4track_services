import { AttendanceStatus } from "src/staff/enum/attendence-status.enum";

export class CreateAttendanceDto {
    id: number;
    staffId: string;
    branchId: number;
    day: Date;
    companyCode: string;
    unitCode: string
    inTime?: Date;
    outTime?: Date;
    status: AttendanceStatus;
    remarks?: string;
}


export class GetAttendanceDto {
    staffId: string;
    // staffUniqueId?: string;
    branchId: number;
    day: Date;
    // inTime: Date;
    // outTime: Date;
    timeRecords: { inTime: Date; outTime: Date }[]
    status: AttendanceStatus;
    staffName: string;
    branchName: string;
    companyCode: string;
    unitCode: string
}
