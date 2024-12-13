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

    async saveWorkAllocationDetails(dto: WorkAllocationDto): Promise<CommonResponse> {
        try {
            const entity = this.workAllocationAdapter.convertDtoToEntity(dto);

            if (!entity.workAllocationNumber) {
                const allocationCount = await this.workAllocationRepository.count({});
                entity.workAllocationNumber = this.generateWorkAllocationNumber(allocationCount + 1);
            }

            await this.workAllocationRepository.save(entity);

            const message = dto.id
                ? 'Work Allocation updated successfully'
                : 'Work Allocation created successfully';

            return new CommonResponse(true, 201, message);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteWorkAllocation(req: WorkAllocationIdDto): Promise<CommonResponse> {
        try {
            const allocation = await this.workAllocationRepository.findOne({ where: { id: req.id } });
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
                where: { id: req.id },
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

    /**
     * Generates a work allocation number in the format #VOU-001.
     * @param sequenceNumber The sequence number for the allocation.
     */
    private generateWorkAllocationNumber(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `#VOU-${paddedNumber}`;
    }
}
