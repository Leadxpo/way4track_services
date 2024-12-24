import { CommonResponse } from "src/models/common-response";
import { LoginDto } from "./dto/login.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";
export declare class LoginService {
    private staffRepository;
    private subDealerRepo;
    constructor(staffRepository: StaffRepository, subDealerRepo: SubDealerRepository);
    LoginDetails(req: LoginDto): Promise<CommonResponse>;
}
