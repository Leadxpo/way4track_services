import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { EstimateRepository } from "src/estimate/repo/estimate.repo";
import { CommonResponse } from "src/models/common-response";
export declare class EstimateDashboardService {
    private repo;
    constructor(repo: EstimateRepository);
    getEstimates(req: {
        fromDate?: string;
        toDate?: string;
        status?: ClientStatusEnum;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
}
