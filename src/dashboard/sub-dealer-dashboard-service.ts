
import { Injectable } from "@nestjs/common";
import { CommonResponse } from "src/models/common-response";
import { DetailSubDealerDto } from "src/sub-dealer/dto/detail-sub-dealer.dto";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";

@Injectable()
export class SubDealerDashboardService {

    constructor(
        private subDealerRepository: SubDealerRepository,
    ) { }
    async getSubDealerData(): Promise<CommonResponse> {
        const SubDealerData = await this.subDealerRepository.getSubDealerData()
        if (!SubDealerData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", SubDealerData)
        }

    }

    async getDetailSubDealerData(req: DetailSubDealerDto): Promise<CommonResponse> {
        const SubDealerData = await this.subDealerRepository.getDetailSubDealerData(req)
        if (!SubDealerData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", SubDealerData)
        }

    }
}