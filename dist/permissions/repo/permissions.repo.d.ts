import { DataSource, Repository } from "typeorm";
import { PermissionEntity } from "../entity/permissions.entity";
export declare class PermissionRepository extends Repository<PermissionEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getStaffPermissions(req: {
        staffId?: string;
        subDealerId?: number;
        companyCode: string;
        unitCode: string;
    }): Promise<any[]>;
}
