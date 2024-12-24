import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonResponse } from "src/models/common-response";
import { LoginDto } from "./dto/login.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";
import { DesignationEnum } from "src/staff/entity/staff.entity";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";

@Injectable()
export class LoginService {

    constructor(
        @InjectRepository(StaffRepository)
        private staffRepository: StaffRepository,
        private subDealerRepo: SubDealerRepository
    ) { }
    async LoginDetails(req: LoginDto): Promise<CommonResponse> {
        let login;
        if (!req.staffId || !req.password || !req.designation || !req.companyCode || !req.unitCode) {
            throw new Error('Missing required login details.');
        }
        if (req.designation === DesignationEnum.SubDealer) {
            login = await this.subDealerRepo.SubDealerLoginDetails(req);
        } else {
            login = await this.staffRepository.LoginDetails(req);
        }
        if (!login) {
            return new CommonResponse(false, 401, "Data does not match the credentials.", []);
        } else {
            return new CommonResponse(true, 200, "Login successful.", login);
        }
    }

}