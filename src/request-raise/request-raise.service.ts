import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { RequestRaiseAdapter } from './request-raise.adapter';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseRepository } from './repo/request-raise.repo';

@Injectable()
export class RequestRaiseService {
    constructor(
        private readonly requestAdapter: RequestRaiseAdapter,
        private readonly requestRepository: RequestRaiseRepository,
    ) { }

    async saveRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse> {
        try {
            const entity = this.requestAdapter.convertDtoToEntity(dto);
            if (!entity.requestId) {
                const requestCount = await this.requestRepository.count();
                entity.requestId = this.generateRequestId(requestCount + 1);
            }

            await this.requestRepository.save(entity);

            const message = dto.id
                ? 'Request details updated successfully'
                : 'Request details created successfully';

            return new CommonResponse(true, 201, message);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse> {
        try {
            const request = await this.requestRepository.findOne({ where: { id: dto.id } });
            if (!request) {
                return new CommonResponse(false, 404, 'Request not found');
            }

            await this.requestRepository.delete(dto.id);

            return new CommonResponse(true, 200, 'Request details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getRequestDetails(req: RequestRaiseIdDto): Promise<CommonResponse> {
        try {
            const request = await this.requestRepository.findOne({ relations: ['staffId', 'branchId'], where: { id: req.id } });
            if (!request) {
                return new CommonResponse(false, 404, 'Request not found');
            }
            return new CommonResponse(true, 200, 'Request details fetched successfully', request);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    /**
     * Generates a requestId in the format RR-${paddedNumber}.
     */
    private generateRequestId(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        return `RR-${paddedNumber}`;
    }

    async getRequestsDropDown(): Promise<CommonResponse> {
        const data = await this.requestRepository.find({ select: ['id', 'requestId'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }
}
