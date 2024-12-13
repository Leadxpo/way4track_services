import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonResponse } from "src/models/common-response";

@Injectable()
export class AssertDashboardService {

    constructor(
        @InjectRepository(AssertsRepository)
        private assertRepo: AssertsRepository,
    ) { }
    async assertCardData(): Promise<CommonResponse> {
        const cardData = await this.assertRepo.assertsCardData()
        console.log(cardData, "{{{{{{{{{{{{{{{{{")
        if (!cardData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", cardData)
        }

    }
}