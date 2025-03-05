import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollDto } from './dto/payroll.dto';
import { PayrollRepository } from './repo/payroll.repo';
import { PayrollAdapter } from './pay-roll.adapter';
import { CommonResponse } from 'src/models/common-response';


@Injectable()
export class PayrollService {
    constructor(
        private payrollRepo: PayrollRepository,
        private adapter: PayrollAdapter
    ) { }
    // async createPayroll(dtoArray: PayrollDto[]): Promise<CommonResponse> {
    //     const entities = this.adapter.toEntity(dtoArray); // Convert DTO array to Entity array
    //     const savedEntities = await this.payrollRepo.save(entities); // Save all entities
    //     return new CommonResponse(true, 200, 'created', savedEntities);
    // }

    async createOrUpdatePayroll(dtoArray: PayrollDto[]): Promise<CommonResponse> {
        const entities = this.adapter.toEntity(dtoArray);
    
        const updatedEntities = await Promise.all(
            entities.map(async (entity) => {
                if (entity.id) {
                    // Check if the payroll record already exists
                    const existingPayroll = await this.payrollRepo.findOne({ where: { id: entity.id } });
                    
                    if (existingPayroll) {
                        // Merge new data with the existing record
                        this.payrollRepo.merge(existingPayroll, entity);
                        return await this.payrollRepo.save(existingPayroll);
                    }
                }
    
                // If no existing record, create a new one
                return await this.payrollRepo.save(entity);
            })
        );
    
        return new CommonResponse(true, 200, 'Payroll processed successfully', updatedEntities);
    }
    
    
}
