import { CommonResponse } from 'src/models/common-response';
import { StaffAdapter } from './staff.adaptert';
import { StaffRepository } from './repo/staff-repo';
import { StaffDto } from './dto/staff.dto';
import { StaffIdDto } from './dto/staff-id.dto';
import { AttendenceRepository } from 'src/attendence/repo/attendence.repo';
export declare class StaffService {
    private adapter;
    private staffRepository;
    private attendanceRepo;
    constructor(adapter: StaffAdapter, staffRepository: StaffRepository, attendanceRepo: AttendenceRepository);
    private saveAttendanceDetails;
    updateStaffDetails(req: StaffDto): Promise<CommonResponse>;
    createStaffDetails(req: StaffDto): Promise<CommonResponse>;
    handleStaffDetails(req: StaffDto): Promise<CommonResponse>;
    deleteStaffDetails(dto: StaffIdDto): Promise<CommonResponse>;
    getStaffDetails(req: StaffIdDto): Promise<CommonResponse>;
    getStaffNamesDropDown(): Promise<CommonResponse>;
    uploadStaffPhoto(staffId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
