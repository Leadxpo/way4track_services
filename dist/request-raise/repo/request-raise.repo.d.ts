import { DataSource, Repository } from "typeorm";
import { RequestRaiseEntity } from "../entity/request-raise.entity";
export declare class RequestRaiseRepository extends Repository<RequestRaiseEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getRequestBranchWise(req: {
        companyCode: string;
        unitCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<any[]>;
}
