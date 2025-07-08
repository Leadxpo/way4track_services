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
        console.log(updatedEntities, "updatedEntities")
        return new CommonResponse(true, 200, 'Payroll processed successfully', updatedEntities);
    }

    async getPayRollStaffDetails(req: { staffId: string; month: string; year: string }): Promise<CommonResponse> {
        const month = Number(req.month);
        const year = Number(req.year);

        if (isNaN(month) || isNaN(year)) {
            return new CommonResponse(false, 35416, "Invalid month or year provided.");
        }

        const branch = await this.payrollRepo.findOne({
            where: {
                staffId: req.staffId,
                month,
                year
            },
        });

        if (!branch) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }

    async getPayRollDetails(req: { month: string; year: string }): Promise<CommonResponse> {
        const month = Number(req.month);
        const year = Number(req.year);

        if (isNaN(month) || isNaN(year)) {
            return new CommonResponse(false, 35416, "Invalid month or year provided.");
        }

        const branch = await this.payrollRepo.find({
            where: {
                month,
                year
            },
        });
        if (!branch) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }

}
