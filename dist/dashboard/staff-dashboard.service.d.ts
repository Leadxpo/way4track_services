import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { PayrollService } from "src/payRoll/pay-roll.service";
import { PayrollRepository } from "src/payRoll/repo/payroll.repo";
import { StaffAttendanceQueryDto } from "src/staff/dto/staff-date.dto";
import { StaffSearchDto } from "src/staff/dto/staff-search.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";
export declare class StaffDashboardService {
    private staffRepository;
    private service;
    private payrollRepo;
    constructor(staffRepository: StaffRepository, service: PayrollService, payrollRepo: PayrollRepository);
    payRoll(req: {
        branch?: string;
        companyCode: string;
        unitCode: string;
        date: string;
    }): Promise<CommonResponse>;
    staffAttendanceDetails(req: StaffAttendanceQueryDto): Promise<CommonResponse>;
    getStaffSearchDetails(req: StaffSearchDto): Promise<CommonResponse>;
    getStaff(req: CommonReq): Promise<CommonResponse>;
    getStaffCardsDetails(req: StaffSearchDto): Promise<CommonResponse>;
    getTotalStaffDetails(req: StaffSearchDto): Promise<CommonResponse>;
    getBranchStaffDetails(req: StaffSearchDto): Promise<CommonResponse>;
    getAllBranchStaffDetails(req: StaffSearchDto): Promise<CommonResponse>;
}
