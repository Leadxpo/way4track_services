import { DesignationEnum } from "../entity/staff.entity";
import { AttendanceStatus } from "../enum/attendence-status.enum";
import { AttendanceDto } from "./attenace-to-staff";

export class StaffDto {
    id?: number;
    name: string;
    phoneNumber: string;
    branchId: number;
    designation: DesignationEnum;
    dob: string;
    email: string;
    aadharNumber: string;
    address: string;
    joiningDate: string;
    attendance: AttendanceStatus;
    basicSalary: number;
    beforeExperience: number;
    staffPhoto?: string;
    attendanceDetails?: AttendanceDto;
    companyCode: string;
    unitCode: string;
    password: string;
    staffId?: string;
}
