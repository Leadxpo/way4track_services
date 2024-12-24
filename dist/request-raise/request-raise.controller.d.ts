import { CommonResponse } from 'src/models/common-response';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseService } from './request-raise.service';
export declare class RequestRaiseController {
    private readonly requestService;
    constructor(requestService: RequestRaiseService);
    handleRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse>;
    deleteRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse>;
    getRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse>;
    getRequestsDropDown(): Promise<CommonResponse>;
    getRequests(req: {
        fromDate?: Date;
        toDate?: Date;
        status?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[] | CommonResponse>;
}
