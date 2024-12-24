import { DataSource, Repository } from "typeorm";
import { HiringEntity } from "../entity/hiring.entity";
export declare class HiringRepository extends Repository<HiringEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
}
