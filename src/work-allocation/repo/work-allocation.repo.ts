import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkAllocationEntity } from "../entity/work-allocation.entity";
import { WorkStatusEnum } from "../enum/work-status-enum";


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
                'wa.unit_code AS unitCode',
                'wa.work_status as workStatus'
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

    async getTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string; // Logged-in staff ID
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'COUNT(wa.id) AS totalAppointments',
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessAppointments'
            ])
            .leftJoin('staff', 'staff', 'wa.staff_id = staff.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('wa.staff_id = :staffId', { staffId: req.staffId }) // Only logged-in staff can view their data
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name');

        const result = await query.setParameter('completed', WorkStatusEnum.COMPLETED).getRawMany();
        return result;
    }

    async getMonthTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string; // Logged-in staff ID
        year: number;  // Year for which data is required
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'YEAR(wa.date) AS year',
                'MONTH(wa.date) AS month',
                'COUNT(wa.id) AS totalAppointments',
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessAppointments'
            ])
            .leftJoin('staff', 'staff', 'wa.staff_id = staff.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('wa.staff_id = :staffId', { staffId: req.staffId }) // Only logged-in staff can view their data
            .andWhere('YEAR(wa.date) = :year', { year: req.year })  // Filter for the specified year
            .groupBy('YEAR(wa.date), MONTH(wa.date)')  // Group by year and month
            .addGroupBy('staff.name')
            .orderBy('YEAR(wa.date), MONTH(wa.date)');  // Order by year and month

        const result = await query.setParameter('completed', WorkStatusEnum.COMPLETED).getRawMany();
        return result;
    }


}