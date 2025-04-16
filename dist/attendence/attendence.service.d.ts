import { AttendenceRepository } from './repo/attendence.repo';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { CommonResponse } from 'src/models/common-response';
import { AttendanceAdapter } from './attendence.adapter';
export declare class AttendanceService {
    private readonly attendanceRepo;
    private readonly adapter;
    private readonly staffRepo;
    constructor(attendanceRepo: AttendenceRepository, adapter: AttendanceAdapter, staffRepo: StaffRepository);
    processAttendanceExcel(file: Express.Multer.File): Promise<{
        message: string;
        inserted: number;
        missingStaffIds: string | number[];
    }>;
    updateAttendanceDetails(dto: CreateAttendanceDto): Promise<CommonResponse>;
    getAttendanceDetailsById(req: CreateAttendanceDto): Promise<CommonResponse>;
    getAttendanceDetails(): Promise<CommonResponse>;
    getStaffAttendance(req: {
        staffId?: string;
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
}
