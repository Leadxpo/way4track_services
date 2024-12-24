import { ClientEntity } from "../entity/client.entity";
import { DataSource, Repository } from "typeorm";
import { ClientDetailDto } from "../dto/detail.client.dto";
import { ClientSearchDto } from "../dto/client-search.dto";
import { CommonReq } from "src/models/common-req";
export declare class ClientRepository extends Repository<ClientEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getClientData(req: CommonReq): Promise<any[]>;
    getDetailClientData(req: ClientDetailDto): Promise<any>;
    getSearchDetailClient(req: ClientSearchDto): Promise<any[]>;
}
