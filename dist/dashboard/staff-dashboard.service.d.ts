import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { StaffAttendanceQueryDto } from "src/staff/dto/staff-date.dto";
import { StaffSearchDto } from "src/staff/dto/staff-search.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";
export declare class StaffDashboardService {
    private staffRepository;
    constructor(staffRepository: StaffRepository);
    payRoll(req: CommonReq): Promise<CommonResponse>;
    staffAttendanceDetails(req: StaffAttendanceQueryDto): Promise<CommonResponse>;
    getStaffSearchDetails(req: StaffSearchDto): Promise<CommonResponse>;
}
