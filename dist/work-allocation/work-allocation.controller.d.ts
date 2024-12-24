import { WorkAllocationService } from './work-allocation.service';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';
import { CommonResponse } from 'src/models/common-response';
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
}
