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

@Injectable()
export class WorkAllocationService {
    constructor(
        private readonly workAllocationAdapter: WorkAllocationAdapter,
        private readonly workAllocationRepository: WorkAllocationRepository,
        private readonly notificationService: NotificationService
    ) { }

    // async assignProductByImei(
    //     staff: StaffEntity,  // Now accepting the full StaffEntity
    //     install: boolean,
    //     imeiNumber: string
    // ): Promise<void> {
    //     const productAssigns = await ProductAssignEntity.find({
    //         where: { imeiNumberFrom: imeiNumber },
    //         relations: ['productId'],
    //     });

    //     for (const productAssign of productAssigns) {
    //         const product = productAssign.productId;

    //         let status = 'not_assigned';
    //         let location = 'warehouse';

    //         if (install) {
    //             status = 'install';
    //             location = staff.name;  // Using the staff name as location
    //         }

    //         product.status = status;
    //         product.location = location;  // Now using the staff name as the location

    //         await product.save();
    //     }
    // }

    async updateWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        try {
            const workAllocation = await this.workAllocationRepository.findOne({
                where: { id: dto.id },
                relations: ['staffId', 'productDetails'],
            });

            if (!workAllocation) {
                throw new Error('Work Allocation not found');
            }

            if (dto.productDetails) {
                for (const productDetail of dto.productDetails) {
                    if (productDetail.install) {
                        const product = await ProductEntity.findOne({
                            where: { imeiNumber: productDetail.imeiNumber },
                        });

                        if (product) {
                            product.status = 'install';
                            product.location = workAllocation.staffId?.name;

                            await product.save();
                        }
                    }
                }
            }
            await this.workAllocationRepository.save(workAllocation);

            return new CommonResponse(true, 200, 'Work allocation updated and product status reflected successfully');
        } catch (error) {
            console.error(`Error updating work allocation: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update work allocation: ${error.message}`);
        }
    }

    async createWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        let successResponse: CommonResponse;
        let newWorkAllocation: WorkAllocationEntity;
        try {
            const updatedProductDetails = dto.productDetails?.map(product => ({
                ...product,
                install: false,
            }));

            dto.productDetails = updatedProductDetails;

            newWorkAllocation = this.workAllocationAdapter.convertDtoToEntity(dto);

            const allocationCount = await this.workAllocationRepository.count({});
            newWorkAllocation.workAllocationNumber = this.generateWorkAllocationNumber(allocationCount + 1);

            const savedWorkAllocation = await this.workAllocationRepository.save(newWorkAllocation);

            if (!savedWorkAllocation) {
                throw new Error('Failed to save work allocation details');
            }

            successResponse = new CommonResponse(true, 201, 'Work Allocation created successfully', newWorkAllocation.workAllocationNumber);

            const productDetailsForNotification = savedWorkAllocation.productDetails.map(product => ({
                imei: product.imeiNumber,
                description: product.productName,
                install: product.install,
            }));

            try {
                if (productDetailsForNotification.length > 0) {
                    await this.notificationService.createNotification(savedWorkAllocation, NotificationEnum.Technician);
                }
            } catch (notificationError) {
                console.error(`Notification failed: ${notificationError.message}`, notificationError.stack);
            }

            return successResponse;
        } catch (error) {
            console.error(`Error creating work allocation details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create work allocation details: ${error.message}`);
        }
    }





    async handleWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        const workAllocation = await this.workAllocationRepository.findOne({
            where: { id: dto.id },
            relations: ['staffId', 'productDetails'],
        });
        if (workAllocation) {
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


    /**
     * Generates a work allocation number in the format #VOU-001.
     * @param sequenceNumber The sequence number for the allocation.
     */
    private generateWorkAllocationNumber(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `#VOU-${paddedNumber}`;
    }
}
