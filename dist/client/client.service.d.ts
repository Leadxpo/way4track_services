import { BranchRepository } from 'src/branch/repo/branch.repo';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ClientAdapter } from './client.adapter';
import { ClientIdDto } from './dto/client-id.dto';
import { ClientDto } from './dto/client.dto';
import { ClientRepository } from './repo/client.repo';
export declare class ClientService {
    private readonly clientAdapter;
    private readonly clientRepository;
    private readonly branchRepo;
    private storage;
    private bucketName;
    constructor(clientAdapter: ClientAdapter, clientRepository: ClientRepository, branchRepo: BranchRepository);
    handleClientDetails(dto: ClientDto, photo?: Express.Multer.File): Promise<CommonResponse>;
    createClientDetails(dto: ClientDto, photoPath?: string | null): Promise<CommonResponse>;
    updateClientDetails(dto: ClientDto, photoPath: string | null): Promise<CommonResponse>;
    deleteClientDetails(dto: ClientIdDto): Promise<CommonResponse>;
    getClientDetailsById(req: ClientIdDto): Promise<CommonResponse>;
    getClientDetails(req: CommonReq): Promise<CommonResponse>;
    getClientNamesDropDown(): Promise<CommonResponse>;
    updateIsStatus(req: ClientIdDto): Promise<CommonResponse>;
    getClientVerification(req: ClientDto): Promise<CommonResponse>;
}
