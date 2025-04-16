import { CommonReq } from "src/models/common-req";
import { DataSource, Repository } from "typeorm";
import { ClientSearchDto } from "../dto/client-search.dto";
import { ClientDetailDto } from "../dto/detail.client.dto";
import { ClientEntity } from "../entity/client.entity";
export declare class ClientRepository extends Repository<ClientEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getClientData(req: CommonReq): Promise<any[]>;
    getDetailClientData(req: ClientDetailDto): Promise<any[]>;
    getSearchDetailClient(req: ClientSearchDto): Promise<any[]>;
}
