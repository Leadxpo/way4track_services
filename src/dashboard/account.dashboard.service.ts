
import { Injectable } from "@nestjs/common";
import { AccountIdDto } from "src/account/dto/account.id.dto";
import { AccountRepository } from "src/account/repo/account.repo";
import { CommonResponse } from "src/models/common-response";

@Injectable()
export class AccountDashboardService {

    constructor(
        private repo: AccountRepository,
    ) { }
    async getAccountBySearch(req: {
        accountName?: string; accountNumber?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const data = await this.repo.getAccountBySearch(req)
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }

    async addVoucherAmount(req: AccountIdDto): Promise<CommonResponse> {
        const data = await this.repo.addVoucherAmount(req)
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }
}