import { CommonResponse } from 'src/models/common-response';
import { RequestRaiseAdapter } from './request-raise.adapter';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseRepository } from './repo/request-raise.repo';
import { NotificationService } from 'src/notifications/notification.service';
import { CommonReq } from 'src/models/common-req';
export declare class RequestRaiseService {
    private readonly requestAdapter;
    private readonly requestRepository;
    private readonly notificationService;
    constructor(requestAdapter: RequestRaiseAdapter, requestRepository: RequestRaiseRepository, notificationService: NotificationService);
    updateRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse>;
    createRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse>;
    handleRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse>;
    deleteRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse>;
    getRequestDetails(req: RequestRaiseIdDto): Promise<CommonResponse>;
    getAllRequestDetails(req: CommonReq): Promise<CommonResponse>;
    getRequestsDropDown(): Promise<CommonResponse>;
    getRequestBranchWise(req: {
        companyCode: string;
        unitCode: string;
        branch?: string;
    }): Promise<CommonResponse>;
    getRequests(filter: {
        fromDate?: Date;
        toDate?: Date;
        branchName?: string;
        staffId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
}
