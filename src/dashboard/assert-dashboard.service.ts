import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";

@Injectable()
export class AssertDashboardService {

    constructor(
        @InjectRepository(AssertsRepository)
        private assertRepo: AssertsRepository,
    ) { }
    async assertsCardData(req: {
        unitCode: string;
        companyCode: string; branch?: string
    }): Promise<CommonResponse> {
        const cardData = await this.assertRepo.assertsCardData(req)
        if (!cardData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", cardData)
        }

    }

    async getAssertDataByDate(req: {
        fromDate?: Date; toDate?: Date; companyCode?: string,
        unitCode?: string
    }): Promise<CommonResponse> {
        const cardData = await this.assertRepo.getAssetDataByDate(req)
        if (!cardData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", cardData)
        }

    }

}