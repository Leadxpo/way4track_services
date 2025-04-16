import { DataSource, Repository } from "typeorm";
import { BranchEntity } from "../entity/branch.entity";
import { BranchIdDto } from "../dto/branch-id.dto";
export declare class BranchRepository extends Repository<BranchEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getBranchStaff(req: BranchIdDto): Promise<any[]>;
}
