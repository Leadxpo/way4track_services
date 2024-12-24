import { DataSource, Repository } from "typeorm";
import { BranchEntity } from "../entity/branch.entity";
export declare class BranchRepository extends Repository<BranchEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
}
