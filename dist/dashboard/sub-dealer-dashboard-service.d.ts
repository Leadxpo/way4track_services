import { CommonResponse } from "src/models/common-response";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { DetailSubDealerDto } from "src/sub-dealer/dto/detail-sub-dealer.dto";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";
export declare class SubDealerDashboardService {
    private subDealerRepository;
    constructor(subDealerRepository: SubDealerRepository);
    getSubDealerData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getDetailSubDealerData(req: DetailSubDealerDto): Promise<CommonResponse>;
}
