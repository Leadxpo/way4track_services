import { DataSource, Repository } from "typeorm";
import { EstimateEntity } from "../entity/estimate.entity";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
export declare class EstimateRepository extends Repository<EstimateEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getEstimates(req: {
        fromDate?: string;
        toDate?: string;
        status?: ClientStatusEnum;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
}
