import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TechnicianWorksEntity } from "../entity/technician-works.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { ClientEntity } from "src/client/entity/client.entity";
import { WorkAllocationEntity } from "src/work-allocation/entity/work-allocation.entity";



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



    // async getUpCommingWorkAllocation(req: {
    //     companyCode?: string;
    //     unitCode?: string;
    //     staffId: string;
    // }) {
    //     const query = this.createQueryBuilder('wa')
    //         .select([
    //             'wa.staff_id AS staffId',
    //             'staff.name AS staffName',
    //             'COUNT(wa.id) AS totalWorks',
    //         ])
    //         .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
    //         .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
    //         .andWhere('wa.date >= :today', { today: new Date() })  // Filter to only upcoming work allocations
    //         .groupBy('wa.staff_id')
    //         .addGroupBy('staff.name');  // Removed DATE_FORMAT from GROUP BY as it's not necessary for grouping by staff and count

    //     const result = await query.getRawMany();
    //     console.log(result, "??????????????????")
    //     return result;
    // }

    // async getUpCommingWorkAllocation(req: {
    //     companyCode?: string;
    //     unitCode?: string;
    //     staffId: string;
    // }) {
    //     const query = this.createQueryBuilder('wa')
    //         .select([
    //             'wa.staff_id AS staffId',
    //             'staff.name AS staffName',
    //             'YEAR(wa.date) AS year',
    //             'WEEK(wa.date) - WEEK(NOW()) + 1 AS weekNumber', // Calculates week number relative to today
    //             'COUNT(wa.id) AS totalTickets'
    //         ])
    //         .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
    //         .where('wa.date BETWEEN :today AND DATE_ADD(:today, INTERVAL 4 WEEK)', {
    //             today: new Date().toISOString().split('T')[0]  // Converts today's date to 'YYYY-MM-DD' format
    //         }) // Get data for the next 4 weeks
    //         .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
    //         .groupBy('wa.staff_id')
    //         .addGroupBy('staff.name')
    //         .addGroupBy('YEAR(wa.date)')
    //         .addGroupBy('WEEK(wa.date) - WEEK(NOW()) + 1'); // Ensures weekly grouping


    //     const result = await query.getRawMany();
    //     console.log(result, "{{{{{{{{{")
    //     return result;
    // }

    // async getUpCommingWorkAllocation(req: {
    //     companyCode?: string;
    //     unitCode?: string;
    //     staffId: string;
    // }) {
    //     const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD

    //     const query = this.createQueryBuilder('wa')
    //         .select([
    //             'wa.staff_id AS staffId',
    //             'staff.name AS staffName',
    //             'YEAR(wa.date) AS year',
    //             `(DATEDIFF(wa.date, :today) DIV 7) + 1 AS weekNumber`, // Adjusted week calculation
    //             'COUNT(wa.id) AS totalTickets',
    //             'SUM(CASE WHEN wa.work_status = :pending THEN 1 ELSE 0 END) AS totalPendingTickets',
    //         ])
    //         .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
    //         .where('wa.date BETWEEN :today AND DATE_ADD(:today, INTERVAL 4 WEEK)', { today })
    //         .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
    //         .groupBy('wa.staff_id')
    //         .addGroupBy('staff.name')
    //         .addGroupBy('YEAR(wa.date)')
    //         .addGroupBy(`(DATEDIFF(wa.date, :today) DIV 7) + 1`); // Ensure correct week grouping

    //     const result = await query.getRawMany();
    //     console.log(result, "{{{{{{{{{");
    //     return result;
    // }

    async getUpCommingWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
    }) {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD

        const query = this.createQueryBuilder('wa')
            .select([
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'YEAR(wa.date) AS year',
                `(DATEDIFF(wa.date, :today) DIV 7) + 1 AS weekNumber`, // Adjusted week calculation
                'COUNT(wa.id) AS totalTickets',
                `SUM(CASE WHEN wa.work_status = 'pending' THEN 1 ELSE 0 END) AS totalPendingTickets`, // Fixed issue
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.date BETWEEN :today AND DATE_ADD(:today, INTERVAL 4 WEEK)', { today })
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .addGroupBy('YEAR(wa.date)')
            .addGroupBy(`(DATEDIFF(wa.date, :today) DIV 7) + 1`); // Ensure correct week grouping

        const result = await query.getRawMany();
        console.log(result, "{{{{{{{{{");
        return result;
    }







    async getStaffWorkAllocation(req: {
        staffId: string; companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.service AS service',
                'wa.payment_status AS paymentStatus',
                'wa.date AS date',
                'staff.name AS staffName',
                'client.name AS clientName',
                'wa.work_status as workStatus',
                'wa.product_name as productName',
                'wa.imei_number as imeiNumber',
                'wa.vehicle_type as vehicleType',
                'wa.vehicle_number as vehicleNumber',
                'wa.chassis_number as chassisNumber',
                'wa.engine_number as engineNumber',
                'wa.vehicle_photo_1 as vehiclePhoto1',
                'wa.vehicle_photo_2 as vehiclePhoto2',
                'wa.vehicle_photo_3 as vehiclePhoto3',
                'wa.vehicle_photo_4 as vehiclePhoto4',
                'wa.description as description',
                'wa.name as clientName',
                'wa.phone_number as phoneNumber',
                'wa.sim_number as simNumber',
                'w.work_allocation_number as workAllocationNumber'
            ])
            .leftJoin(StaffEntity, 'staff', 'staff.id = wa.staff_id')
            .leftJoin(WorkAllocationEntity, 'w', 'w.id = wa.work_id')
            .leftJoin(ClientEntity, 'client', 'wa.client_id = client.id')
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode }) // Changed to .andWhere()
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        const result = await query.getRawMany();
        return result;
    }

    async getDailyWorkCountForWeek(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'DATE(wa.date) AS workDate', // Grouping by day
                'COUNT(wa.id) AS totalTickets'
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.date BETWEEN :today AND DATE_ADD(:today, INTERVAL 6 DAY)', {
                today: new Date().toISOString().split('T')[0]
            }) // Fetch work counts for the next 7 days (one week)
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .addGroupBy('DATE(wa.date)'); // Grouping by date ensures daily breakdown

        const result = await query.getRawMany();
        return result;
    }



}