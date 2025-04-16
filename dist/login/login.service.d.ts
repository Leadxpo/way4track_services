import { CommonResponse } from "src/models/common-response";
import { LoginDto } from "./dto/login.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";
import { SubDealerService } from "src/sub-dealer/sub-dealer.service";
import { StaffService } from "src/staff/staff-services";
import { SubDealerStaffService } from "src/sub-dealer-staff/sub-dealer.staff.service";
export declare class LoginService {
    private staffRepository;
    private subDealerRepo;
    private subDealerService;
    private staffService;
    private subDealerStaff;
    constructor(staffRepository: StaffRepository, subDealerRepo: SubDealerRepository, subDealerService: SubDealerService, staffService: StaffService, subDealerStaff: SubDealerStaffService);
    LoginDetails(req: LoginDto): Promise<CommonResponse>;
    ProfileDetails(req: LoginDto): Promise<CommonResponse>;
}
