import { DataSource, Repository } from "typeorm";
import { AssertsEntity } from "../entity/asserts-entity";
export declare class AssertsRepository extends Repository<AssertsEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    assertsCardData(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
    }): Promise<{
        groupedBranches: {
            branchName: any;
        }[];
        officeAsserts: number;
        transportAsserts: number;
        totalAsserts: number;
    }>;
    getAssetDataByDate(req: {
        fromDate?: Date;
        toDate?: Date;
        companyCode?: string;
        unitCode?: string;
        branch?: string;
    }): Promise<any[]>;
}
