import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { RequestRaiseAdapter } from './request-raise.adapter';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseRepository } from './repo/request-raise.repo';
import { NotificationEnum } from 'src/notifications/entity/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { RequestRaiseEntity } from './entity/request-raise.entity';

@Injectable()
export class RequestRaiseService {
    constructor(
        private readonly requestAdapter: RequestRaiseAdapter,
        private readonly requestRepository: RequestRaiseRepository,
        private readonly notificationService: NotificationService
    ) { }

    async updateRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse> {
        try {
            const existingRequest = await this.requestRepository.findOne({
                where: { id: dto.id, requestId: dto.requestId }
            });

            if (!existingRequest) {
                return new CommonResponse(false, 4002, 'Request not found for the provided id.');
            }

            // Convert DTO to entity and merge the values
            const updatedEntity = this.requestAdapter.convertDtoToEntity(dto);

            // Manually assign updated fields to the existing entity
            Object.assign(existingRequest, updatedEntity);

            // Ensure that the entity is populated correctly before saving
            if (Object.keys(updatedEntity).length === 0) {
                throw new Error("No update values found, skipping update operation.");
            }

            // Save the updated entity
            await this.requestRepository.save(existingRequest);

            return new CommonResponse(true, 65152, 'Request details updated successfully');
        } catch (error) {
            console.error(`Error updating request details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update request details: ${error.message}`);
        }
    }


    async createRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse> {
        let successResponse: CommonResponse;
        let entity: RequestRaiseEntity;
        try {
            // Convert DTO to entity
            entity = this.requestAdapter.convertDtoToEntity(dto);

            // Ensure 'id' is not set before creating a new entity
            entity.id = undefined;  // Set to undefined to prevent accidental update.

            // Manually generate the requestId
            entity.requestId = `RR-${(await this.requestRepository.count() + 1).toString().padStart(5, '0')}`;

            // Save the request data to the database
            const savedEntity = await this.requestRepository.save(entity);

            if (!savedEntity) {
                throw new Error('Failed to save request details');
            }

            // Send a success response after successfully saving the data
            successResponse = new CommonResponse(true, 201, 'Request details created successfully');

            // Send the notification after the successful creation of the request
            try {
                await this.notificationService.createNotification(savedEntity, NotificationEnum.Request);
            } catch (notificationError) {
                console.error(`Notification failed: ${notificationError.message}`, notificationError.stack);
                // Log the notification failure but don't affect the main operation
            }

            return successResponse;
        } catch (error) {
            console.error(`Error creating request details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create request details: ${error.message}`);
        }
    }



    async handleRequestDetails(dto: RequestRaiseDto): Promise<CommonResponse> {
        if (dto.id || dto.requestId) {
            // Update if id or requestId is present
            return await this.updateRequestDetails(dto);
        } else {
            // Create if neither id nor requestId is present
            return await this.createRequestDetails(dto);
        }
    }


    async deleteRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse> {
        try {
            const request = await this.requestRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
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
            const request = await this.requestRepository.findOne({ relations: ['staffId', 'branchId'], where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
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
    // private generateRequestId(sequenceNumber: number): string {
    //     const paddedNumber = sequenceNumber.toString().padStart(4, '0');
    //     return `RR-${paddedNumber}`;
    // }

    async getRequestsDropDown(): Promise<CommonResponse> {
        const data = await this.requestRepository.find({ select: ['id', 'requestId'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

    async getRequests(filter: {
        fromDate?: Date; toDate?: Date; status?: string, companyCode?: string,
        unitCode?: string
    }) {
        const query = this.requestRepository.createQueryBuilder('req')
            .select([
                'req.request_id AS requestNumber',
                'client.name AS client',
                'req.created_date AS paymentDate',
                'req.request_type AS amount',
                'req.status AS status',
                'req.request_to as RequestTo'
            ])
            .leftJoin('req.client_id', 'client')
            .where(`req.company_code = "${filter.companyCode}"`)
            .andWhere(`req.unit_code = "${filter.unitCode}"`)
            .groupBy('req.id, client.id, req.created_date')
            .orderBy('req.created_date', 'DESC');

        if (filter.fromDate) {
            query.andWhere('req.created_date >= :fromDate', { fromDate: filter.fromDate });
        }

        if (filter.toDate) {
            query.andWhere('req.created_date <= :toDate', { toDate: filter.toDate });
        }

        if (filter.status) {
            query.andWhere('req.status = :status', { status: filter.status });
        }

        const result = await query.getRawMany();
        return result;
    }
}
