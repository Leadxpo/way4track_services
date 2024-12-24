import { ClientIdDto } from './dto/client-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ClientDto } from './dto/client.dto';
import { ClientService } from './client.service';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    saveClientDetails(dto: ClientDto): Promise<CommonResponse>;
    deleteClientDetails(dto: ClientIdDto): Promise<CommonResponse>;
    getClientDetails(req: ClientIdDto): Promise<CommonResponse>;
    getClientNamesDropDown(): Promise<CommonResponse>;
    uploadPhoto(clientId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
