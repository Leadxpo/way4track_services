import { DataSource, Repository } from "typeorm";
import { StaffEntity } from "../entity/staff.entity";
import { StaffAttendanceQueryDto } from "../dto/staff-date.dto";
import { LoginDto } from "src/login/dto/login.dto";
import { StaffSearchDto } from "../dto/staff-search.dto";
import { CommonReq } from "src/models/common-req";
export declare class StaffRepository extends Repository<StaffEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    payRoll(req: CommonReq): Promise<any[]>;
    staffAttendanceDetails(req: StaffAttendanceQueryDto): Promise<any[]>;
    LoginDetails(req: LoginDto): Promise<any>;
    getStaffSearchDetails(req: StaffSearchDto): Promise<StaffEntity[]>;
}
