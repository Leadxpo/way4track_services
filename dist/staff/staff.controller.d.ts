import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { StaffIdDto } from './dto/staff-id.dto';
import { StaffDto } from './dto/staff.dto';
import { StaffService } from './staff-services';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    handleStaffDetails(dto: StaffDto, files: {
        photo?: Express.Multer.File[];
        resume?: Express.Multer.File[];
        vehiclePhoto?: Express.Multer.File[];
        qualificationFiles?: Express.Multer.File[];
        offerLetter?: Express.Multer.File[];
        resignationLetter?: Express.Multer.File[];
        terminationLetter?: Express.Multer.File[];
        appointmentLetter?: Express.Multer.File[];
        leaveFormat?: Express.Multer.File[];
        relievingLetter?: Express.Multer.File[];
        experienceLetter?: Express.Multer.File[];
        experience?: Express.Multer.File[];
    }): Promise<CommonResponse>;
    deletestaffDetails(dto: StaffIdDto): Promise<CommonResponse>;
    getStaffVerification(dto: StaffDto): Promise<CommonResponse>;
    getStaffDetailsById(req: StaffIdDto): Promise<CommonResponse>;
    getStaffNamesDropDown(): Promise<CommonResponse>;
    getStaffDetails(req: CommonReq): Promise<CommonResponse>;
}
