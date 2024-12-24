import { WorkAllocationRepository } from './repo/work-allocation.repo';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationAdapter } from './work-allocation.adapter';
import { CommonResponse } from '../models/common-response';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';
export declare class WorkAllocationService {
    private readonly workAllocationAdapter;
    private readonly workAllocationRepository;
    constructor(workAllocationAdapter: WorkAllocationAdapter, workAllocationRepository: WorkAllocationRepository);
    updateWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse>;
    createWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse>;
    handleWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse>;
    deleteWorkAllocation(req: WorkAllocationIdDto): Promise<CommonResponse>;
    getWorkAllocationDetails(req: WorkAllocationIdDto): Promise<CommonResponse>;
    getWorkAllocation(req: {
        workAllocationNumber?: string;
        serviceOrProduct?: string;
        clientName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    private generateWorkAllocationNumber;
}
