import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { EstimateRepository } from "src/estimate/repo/estimate.repo";
import { CommonResponse } from "src/models/common-response";
import { EstimateSendDto } from "src/estimate/dto/estimate.send.dto";
import { ClientRepository } from "src/client/repo/client.repo";
export declare class EstimateDashboardService {
    private repo;
    private clientRepo;
    constructor(repo: EstimateRepository, clientRepo: ClientRepository);
    sendReceipt(dto: EstimateSendDto): Promise<CommonResponse>;
    sendInvoice(dto: EstimateSendDto): Promise<CommonResponse>;
    sendEstimate(dto: EstimateSendDto): Promise<CommonResponse>;
    sendHiring(dto: EstimateSendDto): Promise<CommonResponse>;
    getEstimates(req: {
        fromDate?: string;
        toDate?: string;
        status?: ClientStatusEnum;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getEstimatesForReport(req: {
        estimateId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
}
