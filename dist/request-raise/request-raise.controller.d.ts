import { CommonResponse } from 'src/models/common-response';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseService } from './request-raise.service';
import { CommonReq } from 'src/models/common-req';
export declare class RequestRaiseController {
    private readonly requestService;
    constructor(requestService: RequestRaiseService);
    handleRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse>;
    deleteRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse>;
    getRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse>;
    getAllRequestDetails(dto: CommonReq): Promise<CommonResponse>;
    getRequestsDropDown(): Promise<CommonResponse>;
    getRequests(req: {
        fromDate?: Date;
        toDate?: Date;
        branchName?: string;
        staffId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[] | CommonResponse>;
    getRequestBranchWise(req: {
        companyCode: string;
        unitCode: string;
        branch?: string;
    }): Promise<CommonResponse>;
}
