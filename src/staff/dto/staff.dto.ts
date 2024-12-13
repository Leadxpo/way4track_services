import { AttendanceStatus } from "../enum/attendence-status.enum";
import { AttendanceDto } from "./attenace-to-staff";

export class StaffDto {
    id: number;
    name: string;
    phoneNumber: string;
    staffId: string;
    branchId: number;
    designation: string;
    dob: Date;
    email: string;
    aadharNumber: string;
    address: string;
    joiningDate: Date;
    attendance: AttendanceStatus;
    basicSalary: number;
    beforeExperience: Date;
    staffPhoto?: string;
    attendanceDetails?: AttendanceDto;
}
