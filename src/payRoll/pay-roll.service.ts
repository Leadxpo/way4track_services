import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollDto } from './dto/payroll.dto';
import { PayrollRepository } from './repo/payroll.repo';
import { PayrollAdapter } from './pay-roll.adapter';
import { CommonResponse } from 'src/models/common-response';
import { Between } from 'typeorm';

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


    async getPayDateRangeRoll(req: { staffId: string; fromDate: Date; toDate: Date }): Promise<CommonResponse> {
        const { staffId, fromDate, toDate } = req;
    
        if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return new CommonResponse(false, 35416, "Invalid date range provided.");
        }
    
        const fromMonth = fromDate.getMonth() + 1;
        const fromYear = fromDate.getFullYear();
        const toMonth = toDate.getMonth() + 1;
        const toYear = toDate.getFullYear();
    
        const payrolls = await this.payrollRepo.find({
            where: {
                staffId: staffId,
                year: Between(fromYear, toYear),
                month: Between(fromMonth, toMonth),
            },
        });
    
        if (!payrolls || payrolls.length === 0) {
            return new CommonResponse(false, 35416, "No payroll records found in the given range.");
        }
    
        return new CommonResponse(true, 200, "Payroll records retrieved successfully.", payrolls);
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
