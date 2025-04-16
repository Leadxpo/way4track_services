import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { DataSource, Repository } from "typeorm";
import { EstimateEntity } from "../entity/estimate.entity";
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
    getEstimatesForReport(req: {
        estimateId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
}
