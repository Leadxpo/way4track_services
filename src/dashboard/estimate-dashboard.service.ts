
import { Injectable } from "@nestjs/common";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { EstimateRepository } from "src/estimate/repo/estimate.repo";
import { CommonResponse } from "src/models/common-response";


@Injectable()
export class EstimateDashboardService {

    constructor(
        private repo: EstimateRepository,
    ) { }

    async getEstimates(req: { fromDate?: string; toDate?: string; status?: ClientStatusEnum;companyCode?: string;
        unitCode?: string }): Promise<CommonResponse> {
        const VendorData = await this.repo.getEstimates(req)
        if (!VendorData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VendorData)
        }

    }
}