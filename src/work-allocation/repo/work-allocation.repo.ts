import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkAllocationEntity } from "../entity/work-allocation.entity";
import { WorkStatusEnum } from "../enum/work-status-enum";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { BranchChartDto } from "src/voucher/dto/balance-chart.dto";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { TechnicianWorksEntity } from "src/technician-works/entity/technician-works.entity";


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
                'wa.work_status as workStatus',
                'wa.product_name as productName',
                'wa.service as service',

            ])
            .leftJoin(StaffEntity, 'staff', 'staff.id=wa.staff_id')
            .leftJoin(ClientEntity, 'client', 'wa.client_id=client.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })

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
                'v.amount as amount',
                'COUNT(wa.id) AS totalAppointments',
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessAppointments'
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .leftJoin(VoucherEntity, 'v', 'wa.voucher_id = v.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId }) // Only logged-in staff can view their data
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .addGroupBy('v.amount'); // Add v.amount to the GROUP BY clause

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
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessAppointments',
                'SUM(ve.amount) AS totalSalesAmount',


            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .leftJoin(VoucherEntity, 've', 'wa.voucher_id = ve.id')

            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId }) // Only logged-in staff can view their data
            .andWhere('YEAR(wa.date) = :year', { year: req.year })  // Filter for the specified year
            .groupBy('YEAR(wa.date), MONTH(wa.date)')  // Group by year and month
            .addGroupBy('staff.name')
            .orderBy('YEAR(wa.date), MONTH(wa.date)');  // Order by year and month

        const result = await query.setParameter('completed', WorkStatusEnum.COMPLETED).getRawMany();
        return result;
    }

    async getTotalPendingAndCompletedPercentage(req: BranchChartDto) {
        const year = Number(req.date);
        if (!year || isNaN(year)) {
            throw new Error('Invalid year provided');
        }

        const query = this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.date) AS year`,
                `MONTH(ve.date) AS month`,
                `branch.name AS branchName`,
                `COUNT(ve.id) AS totalWorks`,
                `SUM(CASE WHEN ve.work_status = 'pending' THEN 1 ELSE 0 END) AS totalPending`,
                `SUM(CASE WHEN ve.work_status = 'completed' THEN 1 ELSE 0 END) AS totalCompleted`,
                `ROUND((SUM(CASE WHEN ve.work_status = 'pending' THEN 1 ELSE 0 END) / NULLIF(COUNT(ve.id), 0)) * 100, 2) AS pendingPercentage`,
                `ROUND((SUM(CASE WHEN ve.work_status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(ve.id), 0)) * 100, 2) AS completedPercentage`
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            .andWhere(`YEAR(ve.date) = :year`, { year });

        if (req.branchName) {
            query.andWhere(`LOWER(branch.name) = LOWER(:branchName)`, { branchName: req.branchName });
        }

        query.groupBy('branch.name, YEAR(ve.date), MONTH(ve.date)')
            .orderBy('YEAR(ve.date)', 'ASC')
            .addOrderBy('MONTH(ve.date)', 'ASC')
            .addOrderBy('branch.name', 'ASC');

        return query.getRawMany();
    }

}