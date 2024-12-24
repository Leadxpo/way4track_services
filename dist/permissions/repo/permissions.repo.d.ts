import { DataSource, Repository } from "typeorm";
import { PermissionEntity } from "../entity/permissions.entity";
export declare class PermissionRepository extends Repository<PermissionEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
}
