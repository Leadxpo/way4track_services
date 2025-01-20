import { Injectable } from '@nestjs/common';
import { WorkAllocationRepository } from './repo/work-allocation.repo';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationAdapter } from './work-allocation.adapter';
import { CommonResponse } from '../models/common-response';
import { ErrorResponse } from '../models/error-response';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';
import { NotificationEnum } from 'src/notifications/entity/notification.entity';
import { WorkAllocationEntity } from './entity/work-allocation.entity';
import { NotificationService } from 'src/notifications/notification.service';

@Injectable()
export class WorkAllocationService {
    constructor(
        private readonly workAllocationAdapter: WorkAllocationAdapter,
        private readonly workAllocationRepository: WorkAllocationRepository,
        private readonly notificationService: NotificationService
    ) { }

    async updateWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        try {
            // Find the existing work allocation by its ID
            const existingWorkAllocation = await this.workAllocationRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
            });

            if (!existingWorkAllocation) {
                return new CommonResponse(false, 4002, 'Work Allocation not found for the provided details.');
            }

            // Update the existing work allocation details
            Object.assign(existingWorkAllocation, this.workAllocationAdapter.convertDtoToEntity(dto));
            await this.workAllocationRepository.save(existingWorkAllocation);

            return new CommonResponse(true, 65152, 'Work Allocation updated successfully');
        } catch (error) {
            console.error(`Error updating work allocation details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update work allocation details: ${error.message}`);
        }
    }



    async createWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        let successResponse: CommonResponse;
        let newWorkAllocation: WorkAllocationEntity;
        try {
            // Convert DTO to entity
            newWorkAllocation = this.workAllocationAdapter.convertDtoToEntity(dto);

            // Generate a unique work allocation number
            const allocationCount = await this.workAllocationRepository.count({});
            newWorkAllocation.workAllocationNumber = this.generateWorkAllocationNumber(allocationCount + 1);

            // Save the work allocation data to the database
            const savedWorkAllocation = await this.workAllocationRepository.save(newWorkAllocation);

            if (!savedWorkAllocation) {
                throw new Error('Failed to save work allocation details');
            }

            // Send a success response after successfully saving the data
            successResponse = new CommonResponse(true, 201, 'Work Allocation created successfully', newWorkAllocation.workAllocationNumber);

            // Send the notification after the successful creation of the work allocation
            try {
                if (savedWorkAllocation.install) {
                    await this.notificationService.createNotification(savedWorkAllocation, NotificationEnum.Technician);
                }
            } catch (notificationError) {
                console.error(`Notification failed: ${notificationError.message}`, notificationError.stack);
                // Log the notification failure but don't affect the main operation
            }

            return successResponse;
        } catch (error) {
            console.error(`Error creating work allocation details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create work allocation details: ${error.message}`);
        }
    }


    async handleWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        if (dto.id || dto.workAllocationNumber) {
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

    async markInstall(productId: number, companyCode: string, unitCode: string): Promise<WorkAllocationEntity> {
        const product = await this.workAllocationRepository.findOne({ where: { id: productId, companyCode: companyCode, unitCode: unitCode } });

        if (!product) {
            throw new Error('Product ment not found');
        }

        product.install = true;
        await this.workAllocationRepository.save(product);

        return product;
    }

    async getWorkAllocationDetails(req: WorkAllocationIdDto): Promise<CommonResponse> {
        try {
            const allocation = await this.workAllocationRepository.find({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId']
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
