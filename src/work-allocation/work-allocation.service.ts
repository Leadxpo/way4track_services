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

@Injectable()
export class WorkAllocationService {
    constructor(
        private readonly workAllocationAdapter: WorkAllocationAdapter,
        private readonly workAllocationRepository: WorkAllocationRepository,
        private readonly notificationService: NotificationService,
        private readonly productRepo: ProductRepository
    ) { }

    async updateWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        try {
            const workAllocation = await this.workAllocationRepository.findOne({
                where: { id: dto.id }
            });

            if (!workAllocation) {
                throw new Error('Work Allocation not found');
            }

            Object.assign(workAllocation, this.workAllocationAdapter.convertDtoToEntity(dto));
            await this.workAllocationRepository.save(workAllocation);

            if (dto.productDetails) {
                await Promise.all(
                    dto.productDetails.map(async (productDetail) => {
                        if (productDetail.install) {
                            const product = await this.productRepo.findOne({
                                where: { imeiNumber: productDetail.imeiNumber },
                            });

                            if (product) {
                                product.status = 'install';
                                product.location = workAllocation.staffId?.name;
                                await this.productRepo.save(product);
                            }
                        }
                    })
                );
            }

            return new CommonResponse(true, 200, 'Work allocation updated and product status reflected successfully');
        } catch (error) {
            console.error(`Error updating work allocation: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update work allocation: ${error.message}`);
        }
    }


    async createWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        let newWorkAllocation: WorkAllocationEntity;
        try {
            // Update productDetails with 'install: false'
            const updatedProductDetails = dto.productDetails?.map(product => ({
                ...product,
                install: false,
            }));

            dto.productDetails = updatedProductDetails;

            // Convert DTO to Entity
            newWorkAllocation = this.workAllocationAdapter.convertDtoToEntity(dto);

            // Generate Work Allocation Number
            newWorkAllocation.workAllocationNumber = `#VOU-${(await this.workAllocationRepository.count() + 1)
                .toString()
                .padStart(5, '0')}`;

            // Ensure productDetails is properly set
            newWorkAllocation.productDetails = dto.productDetails;

            // Save the entity instead of insert
            await this.workAllocationRepository.insert(newWorkAllocation);

            // Use savedWorkAllocation to get productDetails
            const productDetailsForNotification = newWorkAllocation.productDetails.map(product => ({
                imei: product.imeiNumber,
                description: product.productName,
                install: product.install,
            }));

            // Send notification if there are product details
            if (productDetailsForNotification.length > 0) {
                await this.notificationService.createNotification(newWorkAllocation, NotificationEnum.Technician);
            }
            return new CommonResponse(true, 200, 'Work allocation creating and product status reflected successfully');
        } catch (error) {
            console.error(`Error creating work allocation details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create work allocation details: ${error.message}`);
        }
    }

    async handleWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {

        if (dto.id && dto.id !== null || dto.workAllocationNumber) {
            // If an ID is provided, update the work allocation details
            return await this.updateWorkAllocationDetails(dto);
        } else {
            // If no ID is provided, create a new work allocation
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
            const allocation = await this.workAllocationRepository.find({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId', 'voucherId']
            });
            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            } else {
                const data = await this.workAllocationAdapter.convertEntityToDto(allocation)
                return new CommonResponse(true, 200, 'Work Allocation fetched successfully', data);
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
     * Generates a work allocation number in the format #VOU-001.
     * @param sequenceNumber The sequence number for the allocation.
     */
    private generateWorkAllocationNumber(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `#VOU-${paddedNumber}`;
    }
}
