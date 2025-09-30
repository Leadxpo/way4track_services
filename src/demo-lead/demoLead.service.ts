import { Injectable } from '@nestjs/common';
import { DemoLeadIdDto } from './dto/demoLead-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { DemoLeadRepository } from './repo/demoLead.repo';
import { DemoLeadAdapter } from './demoLead.adapter';
import { DemoLeadDto } from './dto/demoLead.dto';
import { CommonReq } from 'src/models/common-req';

@Injectable()
export class DemoLeadService {
    constructor(
        private readonly demoLeadRepository: DemoLeadRepository,
        private readonly demoLeadAdapter: DemoLeadAdapter,
    ) {}

    /**
     * Save or Update DemoLead Details
     */
    async updateDemoLeadDetails(dto: DemoLeadDto): Promise<CommonResponse> {
        try {
            // Find the existing demoLead by its ID and company/unit code
            const existingDemoLead = await this.demoLeadRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
            });

            if (!existingDemoLead) {
                return new CommonResponse(false, 4002, 'DemoLead not found for the provided details.');
            }

            // Update the existing demoLead details
            const updatedEntity = this.demoLeadAdapter.convertDtoToEntity(dto);
            // Manually assign updated fields to the existing entity
            Object.assign(existingDemoLead, updatedEntity);

            // Ensure that the entity is populated correctly before saving
            if (Object.keys(updatedEntity).length === 0) {
                throw new Error("No update values found, skipping update operation.");
            }
            await this.demoLeadRepository.save(existingDemoLead);

            return new CommonResponse(true, 65152, 'DemoLead details updated successfully');
        } catch (error) {
            console.error(`Error updating demoLead details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update demoLead details: ${error.message}`);
        }
    }

    async createDemoLeadDetails(dto: DemoLeadDto): Promise<CommonResponse> {
        try {
            const entity = this.demoLeadAdapter.convertDtoToEntity(dto);

            const lastDemoLead = await this.demoLeadRepository
                .createQueryBuilder('demoLead')
                .select('demoLead.demoLeadId')
                .orderBy('demoLead.id', 'DESC')
                .limit(1)
                .getOne();

            let nextNumber = 1;
            if (lastDemoLead && lastDemoLead.demoLeadId) {
                const match = lastDemoLead.demoLeadId.match(/\d+/);
                nextNumber = match ? parseInt(match[0]) + 1 : 1;
            }
            entity.demoLeadId = `A-${nextNumber.toString().padStart(5, '0')}`;

            await this.demoLeadRepository.insert(entity);
            return new CommonResponse(true, 201, 'DemoLead details created successfully');
        } catch (error) {
            console.error(`Error creating demoLead details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create demoLead details: ${error.message}`);
        }
    }

    async handleDemoLeadDetails(dto: DemoLeadDto): Promise<CommonResponse> {

        if (dto.id && dto.id !== null && dto.id !== undefined) {
            dto.id = Number(dto.id);
            return await this.updateDemoLeadDetails(dto);
        } else {
            return await this.createDemoLeadDetails(dto);
        }
    }

    /**
     * Get DemoLead Details by ID
     */
    async getDemoLeadDetails(dto: DemoLeadIdDto): Promise<CommonResponse> {
        try {
            const demoLeads = await this.demoLeadRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });


            if (!demoLeads) {
                throw new ErrorResponse(404, 'DemoLead not found');
            }

            const result = this.demoLeadAdapter.convertEntityToDto([demoLeads]);
            return new CommonResponse(true, 200, 'Details fetched successfully', result);
        } catch (error) {
            console.error('Error in getDemoLeadDetails service:', error);
            throw new ErrorResponse(500, 'Error fetching demoLead details');
        }
    }

    async getAllDemoLeadDetails(dto: CommonReq): Promise<CommonResponse> {
        try {
            const demoLeads = await this.demoLeadRepository.find({
                where: { companyCode: dto.companyCode, unitCode: dto.unitCode },
                order: {
                    createdAt: 'DESC' // or 'ASC' if you want oldest first
                }
            });

            if (!demoLeads) {
                throw new ErrorResponse(404, 'DemoLead not found');
            }

            const result = this.demoLeadAdapter.convertEntityToDto(demoLeads);
            return new CommonResponse(true, 200, 'Details fetched successfully', result);
        } catch (error) {
            console.error('Error in getDemoLeadDetails service:', error);
            throw new ErrorResponse(500, 'Error fetching demoLead details');
        }
    }

    /**
     * Delete DemoLead Details by ID
     */
    async deleteDemoLeadDetails(dto: DemoLeadIdDto): Promise<CommonResponse> {
        try {
            const demoLeadExists = await this.demoLeadRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });

            if (!demoLeadExists) {
                throw new ErrorResponse(404, `DemoLead with ID ${dto.id} does not exist`);
            }

            await this.demoLeadRepository.delete(dto.id);
            return new CommonResponse(true, 200, 'DemoLead details deleted successfully');
        } catch (error) {
            console.error('Error in deleteDemoLeadDetails service:', error);
            throw new ErrorResponse(500, error.message);
        }
    }
}
