import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { EstimateIdDto } from './dto/estimate-id.dto';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateService } from './estimate.service';
export declare class EstimateController {
    private readonly estimateService;
    constructor(estimateService: EstimateService);
    handleEstimateDetails(dto: EstimateDto, files: {
        estimatePdf?: Express.Multer.File[];
        invoicePDF?: Express.Multer.File[];
    }): Promise<CommonResponse>;
    deleteEstimateDetails(dto: EstimateIdDto): Promise<CommonResponse>;
    getEstimateDetails(req: EstimateIdDto): Promise<CommonResponse>;
    getAllEstimateDetails(req: CommonReq): Promise<CommonResponse>;
}
