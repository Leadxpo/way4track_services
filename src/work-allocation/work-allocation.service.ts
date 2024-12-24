import { Injectable } from '@nestjs/common';
import { WorkAllocationRepository } from './repo/work-allocation.repo';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationAdapter } from './work-allocation.adapter';
import { CommonResponse } from '../models/common-response';
import { ErrorResponse } from '../models/error-response';
import { WorkAllocationIdDto } from './dto/work-allocation-id.dto';

@Injectable()
export class WorkAllocationService {
    constructor(
        private readonly workAllocationAdapter: WorkAllocationAdapter,
        private readonly workAllocationRepository: WorkAllocationRepository,
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
        try {
            const entity = this.workAllocationAdapter.convertDtoToEntity(dto);

            // Generate the workAllocationNumber if not already provided
            const allocationCount = await this.workAllocationRepository.count({});
            entity.workAllocationNumber = this.generateWorkAllocationNumber(allocationCount + 1);

            await this.workAllocationRepository.save(entity);

            return new CommonResponse(true, 201, 'Work Allocation created successfully');
        } catch (error) {
            console.error(`Error creating work allocation details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create work allocation details: ${error.message}`);
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
                console.log(data, "++++++++++++++++++++++++")
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
