import { AttendanceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { CommonResponse } from 'src/models/common-response';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    createAttendance(dto: CreateAttendanceDto): Promise<CommonResponse>;
    getAttendance(staffId?: number, branchId?: number): Promise<import("./entity/attendence.entity").AttendanceEntity[] | CommonResponse>;
}
