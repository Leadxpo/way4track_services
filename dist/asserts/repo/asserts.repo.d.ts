import { DataSource, Repository } from "typeorm";
import { AssertsEntity } from "../entity/asserts-entity";
import { CommonReq } from "src/models/common-req";
export declare class AssertsRepository extends Repository<AssertsEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    assertsCardData(req: CommonReq): Promise<{
        officeAsserts: any;
        transportAsserts: any;
        totalAsserts: any;
    }>;
}
