import { DataSource, Repository } from "typeorm";
import { WorkAllocationEntity } from "../entity/work-allocation.entity";
export declare class WorkAllocationRepository extends Repository<WorkAllocationEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getWorkAllocation(req: {
        workAllocationNumber?: string;
        serviceOrProduct?: string;
        clientName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
}
