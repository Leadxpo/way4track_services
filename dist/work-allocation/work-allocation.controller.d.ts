import { CommonResponse } from 'src/models/common-response';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationService } from './work-allocation.service';
import { BranchChartDto } from 'src/voucher/dto/balance-chart.dto';
export declare class WorkAllocationController {
    private readonly workAllocationService;
    constructor(workAllocationService: WorkAllocationService);
    handleWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse>;
    getWorkAllocationDetails(dto: WorkAllocationIdDto): Promise<CommonResponse>;
    deleteWorkAllocation(dto: WorkAllocationIdDto): Promise<CommonResponse>;
    getWorkAllocation(req: {
        workAllocationNumber?: string;
        serviceOrProduct?: string;
        clientName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
    }): Promise<CommonResponse>;
    getMonthTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        year: number;
    }): Promise<CommonResponse>;
    getTotalPendingAndCompletedPercentage(req: BranchChartDto): Promise<CommonResponse>;
}
