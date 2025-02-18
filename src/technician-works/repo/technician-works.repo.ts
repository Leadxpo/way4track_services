import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TechnicianWorksEntity } from "../entity/technician-works.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { PaymentStatus } from "src/product/dto/payment-status.enum";



@Injectable()

export class TechinicianWoksRepository extends Repository<TechnicianWorksEntity> {

    constructor(private dataSource: DataSource) {
        super(TechnicianWorksEntity, dataSource.createEntityManager());
    }

    async getTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        date: string; // Logged-in staff ID
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'DATE_FORMAT(wa.date, "%Y-%m") AS date',
                'wa.staff_id AS staffId', // Corrected to select wa.staff_id
                'staff.name AS staffName',
                'COUNT(wa.id) AS totalAppointments',
                'SUM(CASE WHEN wa.work_status = :pending THEN 1 ELSE 0 END) AS totalPendingAppointments',
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessAppointments'
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('DATE_FORMAT(wa.date, "%Y-%m") = :date', { date: req.date })
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId }) // Only logged-in staff can view their data
            .groupBy('DATE_FORMAT(wa.date, "%Y-%m")') // Group by the formatted date
            .addGroupBy('wa.staff_id')
            .addGroupBy('staff.name'); // Add staff.name to the GROUP BY clause

        // Set the status parameters correctly
        const result = await query
            .setParameter('completed', WorkStatusEnum.COMPLETED)
            .setParameter('pending', WorkStatusEnum.PENDING) // Assuming you need this for pending appointments
            .getRawMany();

        return result;
    }


    async getPaymentWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        date: string; // Logged-in staff ID
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'DATE_FORMAT(wa.date, "%Y-%m") AS date',
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'SUM(CASE WHEN wa.payment_status = :PENDING THEN 1 ELSE 0 END) AS totalPendingPayment',
                'SUM(CASE WHEN wa.payment_status = :COMPLETED THEN 1 ELSE 0 END) AS totalSuccessPayment'
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('DATE_FORMAT(wa.date, "%Y-%m") = :date', { date: req.date })
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .groupBy('DATE_FORMAT(wa.date, "%Y-%m")') // Group by formatted date
            .addGroupBy('wa.staff_id')
            .addGroupBy('staff.name'); // Add staff.name to GROUP BY

        // Set the status parameters correctly using their string values
        const result = await query
            .setParameter('COMPLETED', PaymentStatus.COMPLETED)  // Ensure this is the correct string value
            .setParameter('PENDING', PaymentStatus.PENDING)  // Ensure this is the correct string value
            .getRawMany();

        return result;
    }



    async getUpCommingWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'COUNT(wa.id) AS totalPayment',
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .andWhere('wa.date >= :today', { today: new Date() })  // Filter to only upcoming work allocations
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name');  // Removed DATE_FORMAT from GROUP BY as it's not necessary for grouping by staff and count

        const result = await query.getRawMany();

        return result;
    }



}