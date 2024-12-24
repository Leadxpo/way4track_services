import { ClientRepository } from './repo/client.repo';
import { ClientDto } from './dto/client.dto';
import { ClientIdDto } from './dto/client-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ClientAdapter } from './client.adapter';
import { BranchRepository } from 'src/branch/repo/branch.repo';
export declare class ClientService {
    private readonly clientAdapter;
    private readonly clientRepository;
    private readonly branchRepo;
    constructor(clientAdapter: ClientAdapter, clientRepository: ClientRepository, branchRepo: BranchRepository);
    saveClientDetails(dto: ClientDto): Promise<CommonResponse>;
    deleteClientDetails(dto: ClientIdDto): Promise<CommonResponse>;
    getClientDetails(req: ClientIdDto): Promise<CommonResponse>;
    private generateClientId;
    getClientNamesDropDown(): Promise<CommonResponse>;
    uploadClientPhoto(clientId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
