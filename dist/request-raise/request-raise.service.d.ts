import { CommonResponse } from 'src/models/common-response';
import { RequestRaiseAdapter } from './request-raise.adapter';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseRepository } from './repo/request-raise.repo';
export declare class RequestRaiseService {
    private readonly requestAdapter;
    private readonly requestRepository;
    constructor(requestAdapter: RequestRaiseAdapter, requestRepository: RequestRaiseRepository);
    updateRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse>;
    createRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse>;
    handleRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse>;
    deleteRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse>;
    getRequestDetails(req: RequestRaiseIdDto): Promise<CommonResponse>;
    getRequestsDropDown(): Promise<CommonResponse>;
    getRequests(filter: {
        fromDate?: Date;
        toDate?: Date;
        status?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
}
