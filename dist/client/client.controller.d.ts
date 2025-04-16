import { ClientIdDto } from './dto/client-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ClientDto } from './dto/client.dto';
import { ClientService } from './client.service';
import { CommonReq } from 'src/models/common-req';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    handleClientDetails(dto: ClientDto, file: Express.Multer.File): Promise<CommonResponse>;
    deleteClientDetails(dto: ClientIdDto): Promise<CommonResponse>;
    getClientDetails(req: CommonReq): Promise<CommonResponse>;
    getClientDetailsById(req: ClientIdDto): Promise<CommonResponse>;
    getClientNamesDropDown(): Promise<CommonResponse>;
    updateIsStatus(dto: ClientIdDto): Promise<CommonResponse>;
    getClientVerification(req: ClientDto): Promise<CommonResponse>;
}
