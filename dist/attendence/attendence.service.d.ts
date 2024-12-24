import { AttendenceRepository } from './repo/attendence.repo';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { AttendanceEntity } from './entity/attendence.entity';
import { AttendanceAdapter } from './attendence.adapter';
import { CommonResponse } from 'src/models/common-response';
export declare class AttendanceService {
    private attendanceRepository;
    private staffRepository;
    private adapter;
    private branchRepository;
    constructor(attendanceRepository: AttendenceRepository, staffRepository: StaffRepository, adapter: AttendanceAdapter, branchRepository: BranchRepository);
    saveAttendance(dto: CreateAttendanceDto): Promise<CommonResponse>;
    getAttendance(staffId?: number, branchId?: number, dateRange?: {
        start: string;
        end: string;
    }, companyCode?: string, unitCode?: string): Promise<AttendanceEntity[]>;
}
