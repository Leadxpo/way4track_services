import { Injectable } from '@nestjs/common';
import { EstimateDto } from './dto/estimate.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { EstimateAdapter } from './estimate.adapter';
import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateIdDto } from './dto/estimate-id.dto';
import { EstimateRepository } from './repo/estimate.repo';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ClientRepository } from 'src/client/repo/client.repo';
import { EstimateEntity } from './entity/estimate.entity';

@Injectable()
export class EstimateService {
    constructor(
        private readonly estimateAdapter: EstimateAdapter,
        private readonly estimateRepository: EstimateRepository,
        private readonly clientRepository: ClientRepository
    ) { }

    async saveEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.findOne({ where: { clientId: dto.clientId } });
            if (!client) {
                throw new ErrorResponse(400, `Client with ID ${dto.clientId} not found`);
            }

            let entity: EstimateEntity;

            if (dto.id) {
                const existingEntity = await this.estimateRepository.findOne({ where: { id: dto.id } });
                if (!existingEntity) {
                    throw new ErrorResponse(404, `Estimate with ID ${dto.id} not found`);
                }

                entity = this.estimateRepository.merge(existingEntity, {
                    ...dto,
                    clientId: client,
                });
            } else {
                entity = this.estimateAdapter.convertDtoToEntity(dto);

                entity.clientId = client;

                const estimateCount = await this.estimateRepository.count({
                    where: { clientId: client },
                });
                entity.estimateId = this.generateEstimateId(estimateCount + 1);
            }

            await this.estimateRepository.save(entity);

            const message = dto.id
                ? 'Estimate details updated successfully'
                : 'Estimate details created successfully';

            return new CommonResponse(true, 201, message);
        } catch (error) {
            console.error('Error saving estimate details:', error);
            throw new ErrorResponse(500, error.message);
        }
    }


    async deleteEstimateDetails(dto: EstimateIdDto): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.findOne({ where: { id: dto.id } });
            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            await this.estimateRepository.delete(dto.id);
            return new CommonResponse(true, 200, 'Estimate details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getEstimateDetails(req: EstimateIdDto): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.findOne({
                relations: ['clientId'],
                where: { id: req.id }
            });

            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            const data: EstimateResDto = this.estimateAdapter.convertEntityToResDto(estimate);
            return new CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    private generateEstimateId(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        return `EST-${paddedNumber}`;
    }
}
