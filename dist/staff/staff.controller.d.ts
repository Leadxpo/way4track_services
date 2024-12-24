import { CommonResponse } from 'src/models/common-response';
import { StaffIdDto } from './dto/staff-id.dto';
import { StaffService } from './staff-services';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    handleStaffDetails(req: any): Promise<CommonResponse>;
    deletestaffDetails(dto: StaffIdDto): Promise<CommonResponse>;
    getstaffDetails(req: StaffIdDto): Promise<CommonResponse>;
    getStaffNamesDropDown(): Promise<CommonResponse>;
    uploadPhoto(staffId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
