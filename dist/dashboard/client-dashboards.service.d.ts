import { ClientSearchDto } from "src/client/dto/client-search.dto";
import { ClientDetailDto } from "src/client/dto/detail.client.dto";
import { ClientRepository } from "src/client/repo/client.repo";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
export declare class ClientDashboardService {
    private clientRepository;
    constructor(clientRepository: ClientRepository);
    getClientData(req: CommonReq): Promise<CommonResponse>;
    getDetailClientData(req: ClientDetailDto): Promise<CommonResponse>;
    getSearchDetailClient(req: ClientSearchDto): Promise<CommonResponse>;
}
