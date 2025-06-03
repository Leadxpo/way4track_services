import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonResponse } from "src/models/common-response";
import { LoginDto } from "./dto/login.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";
import { SubDealerService } from "src/sub-dealer/sub-dealer.service";
import { StaffService } from "src/staff/staff-services";
import { SubDealerStaffService } from "src/sub-dealer-staff/sub-dealer.staff.service";

@Injectable()
export class LoginService {

    constructor(
        @InjectRepository(StaffRepository)
        private staffRepository: StaffRepository,
        private subDealerRepo: SubDealerRepository,
        private subDealerService: SubDealerService,
        private staffService: StaffService,
        private subDealerStaff: SubDealerStaffService
    ) { }
    async LoginDetails(req: LoginDto): Promise<CommonResponse> {
        const designation = req.designation.toLowerCase();
        let login;
        if (!req.staffId || !req.password || !req.designation || !req.companyCode || !req.unitCode) {
            throw new Error('Missing required login details.');
        }

        if (designation === 'sub dealer') {
            login = await this.subDealerService.getSubDealerProfileDetails(req);
            console.log(login, ">>")
        } else if (designation === 'sub dealer staff') {
            login = await this.subDealerStaff.getSubDealerStaffLogin(req);
        }
        else {
            login = await this.staffService.getStaffProfileDetails(req);
        }
        if (!login) {
            return new CommonResponse(false, 401, "Data does not match the credentials.", []);
        } else {
            return new CommonResponse(true, 200, "Login successful.", login);
        }
    }

    async ProfileDetails(req: LoginDto): Promise<CommonResponse> {
        const designation = req.designation.toLowerCase();
        let login;
        if (!req.staffId || !req.password || !req.designation || !req.companyCode || !req.unitCode) {
            throw new Error('Missing required login details.');
        }
        if (designation === 'subdealer') {
            login = await this.subDealerService.getSubDealerProfileDetails(req);
        } else {
            login = await this.staffService.getStaffProfileDetails(req);
        }
        if (!login) {
            return new CommonResponse(false, 401, "Data does not match the credentials.", []);
        } else {
            return new CommonResponse(true, 200, "Login successful.", login);
        }
    }

} 