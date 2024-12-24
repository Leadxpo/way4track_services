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

    async updateEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        try {
            const existingEstimate = await this.estimateRepository.findOne({
                where: { id: dto.id },
            });
    
            if (!existingEstimate) {
                return new CommonResponse(false, 404, `Estimate with ID ${dto.id} not found`);
            }
    
            const client = await this.clientRepository.findOne({
                where: { clientId: dto.clientId },
            });
    
            if (!client) {
                return new CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }
    
            Object.assign(existingEstimate, this.estimateAdapter.convertDtoToEntity(dto));
            existingEstimate.clientId = client;
    
            await this.estimateRepository.save(existingEstimate);
    
            return new CommonResponse(true, 200, 'Estimate details updated successfully');
        } catch (error) {
            console.error(`Error updating estimate details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update estimate details: ${error.message}`);
        }
    }
    
    async createEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.findOne({
                where: { clientId: dto.clientId },
            });
    
            if (!client) {
                return new CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }
    
            const newEstimate = this.estimateAdapter.convertDtoToEntity(dto);
            newEstimate.clientId = client;
    
            const estimateCount = await this.estimateRepository.count({
                where: { clientId: client },
            });
            newEstimate.estimateId = this.generateEstimateId(estimateCount + 1);
    
            await this.estimateRepository.save(newEstimate);
    
            return new CommonResponse(true, 201, 'Estimate details created successfully');
        } catch (error) {
            console.error(`Error creating estimate details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create estimate details: ${error.message}`);
        }
    }
    
    async handleEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        if (dto.id) {
            // If an ID is provided, update the estimate details
            return await this.updateEstimateDetails(dto);
        } else {
            // If no ID is provided, create a new estimate record
            return await this.createEstimateDetails(dto);
        }
    }
    
    private generateEstimateId(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        return `EST-${paddedNumber}`;
    }
    


    async deleteEstimateDetails(dto: EstimateIdDto): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
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
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }
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

    
}
