
import { Injectable } from "@nestjs/common";
import { CommonResponse } from "src/models/common-response";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { DetailSubDealerDto } from "src/sub-dealer/dto/detail-sub-dealer.dto";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";

@Injectable()
export class SubDealerDashboardService {

    constructor(
        private subDealerRepository: SubDealerRepository,
    ) { }
    async getSubDealerData(req: {
        fromDate?: Date; toDate?: Date; paymentStatus?: PaymentStatus; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const SubDealerData = await this.subDealerRepository.getSubDealerData(req)
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