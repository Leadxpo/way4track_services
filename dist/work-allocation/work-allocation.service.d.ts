import { NotificationService } from 'src/notifications/notification.service';
import { CommonResponse } from '../models/common-response';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationRepository } from './repo/work-allocation.repo';
import { WorkAllocationAdapter } from './work-allocation.adapter';
import { ProductRepository } from 'src/product/repo/product.repo';
import { TechnicianService } from 'src/technician-works/technician-works.service';
import { SalesworkRepository } from 'src/sales-man/repo/sales-man.repo';
import { BranchChartDto } from 'src/voucher/dto/balance-chart.dto';
export declare class WorkAllocationService {
    private readonly workAllocationAdapter;
    private readonly workAllocationRepository;
    private readonly notificationService;
    private readonly productRepo;
    private readonly service;
    private readonly salesworkRepository;
    constructor(workAllocationAdapter: WorkAllocationAdapter, workAllocationRepository: WorkAllocationRepository, notificationService: NotificationService, productRepo: ProductRepository, service: TechnicianService, salesworkRepository: SalesworkRepository);
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
    private generateWorkAllocationNumber;
    getTotalPendingAndCompletedPercentage(req: BranchChartDto): Promise<CommonResponse>;
}
