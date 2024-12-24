import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkAllocationEntity } from "../entity/work-allocation.entity";


@Injectable()

export class WorkAllocationRepository extends Repository<WorkAllocationEntity> {

    constructor(private dataSource: DataSource) {
        super(WorkAllocationEntity, dataSource.createEntityManager());
    }

    async getWorkAllocation(req: {
        workAllocationNumber?: string; serviceOrProduct?: string; clientName?: string, companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.id AS id',
                'wa.work_allocation_number AS workAllocationNumber',
                'wa.service_or_product AS serviceOrProduct',
                'wa.other_information AS otherInformation',
                'wa.date AS date',
                'staff.name AS staffName',
                'client.name AS clientName',
                'wa.company_code AS companyCode',
                'wa.unit_code AS unitCode'
            ])
            .leftJoin('wa.staffId', 'staff')
            .leftJoin('wa.clientId', 'client');

        if (req.workAllocationNumber) {
            query.andWhere('wa.work_allocation_number = :workAllocationNumber', { workAllocationNumber: req.workAllocationNumber });
        }

        if (req.serviceOrProduct) {
            query.andWhere('wa.service_or_product = :serviceOrProduct', { serviceOrProduct: req.serviceOrProduct });
        }

        if (req.clientName) {
            query.andWhere('client.name = :clientName', { clientName: req.clientName });
        }

        const result = await query.getRawMany();
        return result;
    }

}