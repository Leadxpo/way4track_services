import { Injectable } from '@nestjs/common';
import { NotificationEnum } from 'src/notifications/entity/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { ProductEntity } from 'src/product/entity/product.entity';
import { CommonResponse } from '../models/common-response';
import { ErrorResponse } from '../models/error-response';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationEntity } from './entity/work-allocation.entity';
import { WorkAllocationRepository } from './repo/work-allocation.repo';
import { WorkAllocationAdapter } from './work-allocation.adapter';
import { ProductRepository } from 'src/product/repo/product.repo';
import { TechnicianService } from 'src/technician-works/technician-works.service';
import { WorkStatusEnum } from './enum/work-status-enum';
import { PaymentStatus } from 'src/product/dto/payment-status.enum';
import { TechnicianWorksDto } from 'src/technician-works/dto/technician-works.dto';
import { SalesworkRepository } from 'src/sales-man/repo/sales-man.repo';
import { BranchChartDto } from 'src/voucher/dto/balance-chart.dto';

@Injectable()
export class WorkAllocationService {
    constructor(
        private readonly workAllocationAdapter: WorkAllocationAdapter,
        private readonly workAllocationRepository: WorkAllocationRepository,
        private readonly notificationService: NotificationService,
        private readonly productRepo: ProductRepository,
        private readonly service: TechnicianService,
        private readonly salesworkRepository: SalesworkRepository
    ) { }

    async updateWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        try {
            const workAllocation = await this.workAllocationRepository.findOne({
                where: { id: dto.id }
            });

            if (!workAllocation) {
                throw new Error('Work Allocation not found');
            }

            // Get unique product names using Set
            // const uniqueProductNames = [...new Set(dto.productDetails?.map(product => product.productName))];

            // Fetch products based on unique product names (no price included)
            // const products = await this.productRepo
            //     .createQueryBuilder('product')
            //     .where('product.product_name IN (:...uniqueProductNames)', { uniqueProductNames })
            //     .getMany();

            // Update product details to include only productName (no price)
            // const updatedProductDetails = uniqueProductNames.map(name => ({
            //     productName: name,
            // }));

            const updatedWorkAllocation = this.workAllocationAdapter.convertDtoToEntity(dto);

            // if (!dto.productDetails || dto.productDetails.length === 0) {
            //     updatedWorkAllocation.productId = null; // or handle it properly
            // }

            // updatedWorkAllocation.productDetails = updatedProductDetails;
            console.log(workAllocation, "++++++}}}}}}}}}}}")

            console.log(updatedWorkAllocation, "{{{{{{{{{{{}}}}}}}}}}}}")

            // Merge updated details into the existing work allocation
            Object.assign(workAllocation, updatedWorkAllocation);

            // Save the updated work allocation
            await this.workAllocationRepository.save(workAllocation);

            return new CommonResponse(true, 200, 'Work allocation updated successfully with product details');
        } catch (error) {
            console.error(`Error updating work allocation: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update work allocation: ${error.message}`);
        }
    }

    async createWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        let newWorkAllocation: WorkAllocationEntity;
        try {

            newWorkAllocation = this.workAllocationAdapter.convertDtoToEntity(dto);
            newWorkAllocation.workAllocationNumber = `#VOU-${(await this.workAllocationRepository.count() + 1)
                .toString()
                .padStart(5, '0')}`;
           
            await this.workAllocationRepository.insert(newWorkAllocation);
            // const technicianDto: TechnicianWorksDto = {
            //     service: "",
            //     workStatus: WorkStatusEnum.PENDING,
            //     paymentStatus: PaymentStatus.PENDING,
            //     imeiNumber: "",
            //     vehicleType: "",
            //     vehicleNumber: "",
            //     chassisNumber: "",
            //     engineNumber: "",
            //     description: "",
            //     date: dto.date,
            //     staffId: dto.staffId ?? null,
            //     branchId: dto.branchId ?? null,
            //     productId: dto.productId ?? null,
            //     vendorId: dto.vendorId ?? null,
            //     clientId: dto.clientId ?? null,
            //     voucherId: dto.voucherId ?? null,
            //     workId: newWorkAllocation.id,
            //     companyCode: dto.companyCode ?? "",
            //     unitCode: dto.unitCode ?? "",
            //     productName: dto.productName ?? "",
            //     name: "",
            //     phoneNumber: "",
            //     simNumber: "",
            //     address: "",
            //     amount: dto.amount || 0
            //     // requirementDetails: []
            // };

            // await this.service.createTechnicianDetails(technicianDto);

            return new CommonResponse(true, 200, 'Work allocation and technician details created successfully');
        } catch (error) {
            console.error(`Error creating work allocation details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create work allocation details: ${error.message}`);
        }
    }

    async handleWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {

        if (dto.id || (dto.workAllocationNumber && dto.workAllocationNumber.trim() !== '')) {
            return await this.updateWorkAllocationDetails(dto);
        } else {
            return await this.createWorkAllocationDetails(dto);
        }
    }

    async deleteWorkAllocation(req: WorkAllocationIdDto): Promise<CommonResponse> {
        try {
            const allocation = await this.workAllocationRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            }
            await this.workAllocationRepository.delete(req.id);
            return new CommonResponse(true, 200, 'Work Allocation deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getWorkAllocationDetails(req: WorkAllocationIdDto): Promise<CommonResponse> {
        try {
            console.log(req, "req")
            const allocation = await this.workAllocationRepository.find({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId', 'voucherId'],
                order: {
                    createdAt: 'DESC'  // <- this is what adds the descending sort
                }
            });
            console.log(allocation, "allocation")

            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            } else {
                // const data = await this.workAllocationAdapter.convertEntityToDto(allocation)
                return new CommonResponse(true, 200, 'Work Allocation fetched successfully', allocation);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getWorkAllocation(req: {
        workAllocationNumber?: string; serviceOrProduct?: string; clientName?: string, companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.workAllocationRepository.getWorkAllocation(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.workAllocationRepository.getTotalWorkAllocation(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getMonthTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string; // Logged-in staff ID
        year: number;
    }): Promise<CommonResponse> {
        const VoucherData = await this.workAllocationRepository.getMonthTotalWorkAllocation(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }
    /**
     * 
     * 
     * @param sequenceNumber The sequence number for the allocation.
     */
    private generateWorkAllocationNumber(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `#VOU-${paddedNumber}`;
    }



    async getTotalPendingAndCompletedPercentage(req: BranchChartDto): Promise<CommonResponse> {
        const VoucherData = await this.workAllocationRepository.getTotalPendingAndCompletedPercentage(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }
}
