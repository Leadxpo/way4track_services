import { EstimateDto } from './dto/estimate.dto';
import { CommonResponse } from 'src/models/common-response';
import { EstimateService } from './estimate.service';
import { EstimateIdDto } from './dto/estimate-id.dto';
export declare class EstimateController {
    private readonly estimateService;
    constructor(estimateService: EstimateService);
    handleEstimateDetails(dto: EstimateDto): Promise<CommonResponse>;
    deleteEstimateDetails(dto: EstimateIdDto): Promise<CommonResponse>;
    getEstimateDetails(req: EstimateIdDto): Promise<CommonResponse>;
}
