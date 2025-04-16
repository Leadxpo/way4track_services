import { AttendanceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { CommonResponse } from 'src/models/common-response';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    updateAttendanceDetails(dto: CreateAttendanceDto): Promise<CommonResponse>;
    getAttendanceDetails(): Promise<CommonResponse>;
    getAttendanceDetailsById(req: CreateAttendanceDto): Promise<CommonResponse>;
    getStaffAttendance(req: {
        staffId?: string;
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    uploadAttendance(file: Express.Multer.File): Promise<{
        message: string;
        inserted: number;
        missingStaffIds: string | number[];
    } | {
        message: string;
    }>;
}
