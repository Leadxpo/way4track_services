import { DataSource, Repository } from "typeorm";
import { StaffEntity } from "../entity/staff.entity";
import { StaffAttendanceQueryDto } from "../dto/staff-date.dto";
import { LoginDto } from "src/login/dto/login.dto";
import { StaffSearchDto } from "../dto/staff-search.dto";
export declare class StaffRepository extends Repository<StaffEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    payRoll(req: {
        branch?: string;
        companyCode: string;
        unitCode: string;
        date: string;
    }): Promise<{
        staffId: any;
        staffName: any;
        branch: any;
        designation: any;
        staffPhoto: any;
        year: number;
        month: number;
        monthDays: number;
        presentDays: number;
        leaveDays: number;
        actualSalary: number;
        totalEarlyHours: number;
        totalLateHours: number;
        lateDays: number;
        perDaySalary: number;
        perHourSalary: number;
        totalOTHours: number;
        OTAmount: number;
        lateDeductions: number;
        grossSalary: number;
        ESIC_Employee: number;
        ESIC_Employer: number;
        PF_Employee: number;
        PF_Employer1: number;
        PF_Employer2: number;
        extraHalfSalary: number;
        daysOutLate6HoursOrMore: number;
        netSalary: number;
        salaryStatus: string;
        carryForwardLeaves: number;
        professionalTax: number;
        incentives: number;
        foodAllowance: number;
        leaveEncashment: number;
        plBikeNeedToPay: number;
        plBikeAmount: number;
        advanceAmount: number;
        payableAmount: number;
    }[]>;
    staffAttendanceDetails(req: StaffAttendanceQueryDto): Promise<{
        day: string;
        name: any;
        phoneNumber: any;
        designation: any;
        dob: any;
        email: any;
        aadharNumber: any;
        address: any;
        branchName: any;
        inTime: any;
        outTime: any;
        status: any;
        totalHours: string;
    }[]>;
    calculateTotalHours(timeRecords: {
        inTime: Date;
        outTime: Date;
    }[]): Promise<number>;
    LoginDetails(req: LoginDto): Promise<any>;
    getStaffSearchDetails(req: StaffSearchDto): Promise<any[]>;
    getStaff(req: {
        companyCode: string;
        unitCode: string;
        staffId?: string;
    }): Promise<StaffEntity[]>;
    getStaffCardsDetails(req: StaffSearchDto): Promise<any>;
    getTotalStaffDetails(req: StaffSearchDto): Promise<{
        result: any[];
        staff: any[];
    }>;
    getBranchStaffDetails(req: StaffSearchDto): Promise<{
        status: boolean;
        errorCode: number;
        internalMessage: string;
        data: any[];
    }>;
    getAllBranchStaffDetails(req: StaffSearchDto): Promise<any[]>;
}
