import { EstimateDto } from './dto/estimate.dto';
import { CommonResponse } from 'src/models/common-response';
import { EstimateAdapter } from './estimate.adapter';
import { EstimateIdDto } from './dto/estimate-id.dto';
import { EstimateRepository } from './repo/estimate.repo';
import { ClientRepository } from 'src/client/repo/client.repo';
export declare class EstimateService {
    private readonly estimateAdapter;
    private readonly estimateRepository;
    private readonly clientRepository;
    constructor(estimateAdapter: EstimateAdapter, estimateRepository: EstimateRepository, clientRepository: ClientRepository);
    updateEstimateDetails(dto: EstimateDto): Promise<CommonResponse>;
    createEstimateDetails(dto: EstimateDto): Promise<CommonResponse>;
    handleEstimateDetails(dto: EstimateDto): Promise<CommonResponse>;
    private generateEstimateId;
    deleteEstimateDetails(dto: EstimateIdDto): Promise<CommonResponse>;
    getEstimateDetails(req: EstimateIdDto): Promise<CommonResponse>;
}
