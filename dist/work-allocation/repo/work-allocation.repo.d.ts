import { DataSource, Repository } from "typeorm";
import { WorkAllocationEntity } from "../entity/work-allocation.entity";
import { BranchChartDto } from "src/voucher/dto/balance-chart.dto";
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
    getTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
    }): Promise<any[]>;
    getMonthTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        year: number;
    }): Promise<any[]>;
    getTotalPendingAndCompletedPercentage(req: BranchChartDto): Promise<any[]>;
}
