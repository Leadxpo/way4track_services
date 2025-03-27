import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TechnicianWorksEntity } from "../entity/technician-works.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { ClientEntity } from "src/client/entity/client.entity";
import { WorkAllocationEntity } from "src/work-allocation/entity/work-allocation.entity";
import { CommonReq } from "src/models/common-req";
import { BranchChartDto } from "src/voucher/dto/balance-chart.dto";
import { BranchEntity } from "src/branch/entity/branch.entity";



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

    async getPaymentStatus(req: CommonReq) {
        const query = this.createQueryBuilder('wa')
            .select([
                'SUM(CASE WHEN wa.payment_status = :PENDING THEN 1 ELSE 0 END) AS totalPendingPayment',
                'SUM(CASE WHEN wa.payment_status = :COMPLETED THEN 1 ELSE 0 END) AS totalSuccessPayment',
                'COUNT(*) AS totalPayments' // Count all payments regardless of status
            ])
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        const result = await query
            .setParameter('COMPLETED', PaymentStatus.COMPLETED)
            .setParameter('PENDING', PaymentStatus.PENDING)
            .getRawOne(); // Use `getRawOne` instead of `getRawMany` since we're expecting a single result

        return result;
    }


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
                'wa.id as id',
                'wa.service AS service',
                'wa.payment_status AS paymentStatus',
                'wa.date AS date',
                'staff.name AS staffName',
                'client.client_id as clientId',
                'wa.client_id as WaclientId',
                'client.name AS clientName',
                'client.phone_number as phoneNumber',
                'client.email as email',
                'client.address as address',
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
                'wa.name as WaclientName',
                'wa.phone_number as WaphoneNumber',
                'wa.sim_number as simNumber',
                'w.work_allocation_number as workAllocationNumber',

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

    //New APIS--------------------------------------
    async getPaymentStatusPayments(req: BranchChartDto) {
        const query = this.createQueryBuilder('wa')
            .select([
                `COALESCE(SUM(wa.amount), 0) AS totalPayment`,
                `COALESCE(SUM(CASE WHEN wa.payment_status = :PENDING THEN wa.amount ELSE 0 END), 0) AS totalPendingPayment`,
                `COALESCE(SUM(CASE WHEN wa.payment_status = :COMPLETED THEN wa.amount ELSE 0 END), 0) AS totalSuccessPayment`
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = wa.branch_id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.date) {
            const dateObj = new Date(req.date);
            if (!isNaN(dateObj.getTime())) {  // Check if valid date
                const year = dateObj.getFullYear();
                const month = dateObj.getMonth() + 1; // getMonth() is 0-based, so add 1

                query.andWhere('YEAR(wa.date) = :year', { year });
                query.andWhere('MONTH(wa.date) = :month', { month });
            }
        }
        if (req.branchName) {
            query.andWhere(`LOWER(br.name) = LOWER(:branchName)`, { branchName: req.branchName });
        }

        return query
            .setParameter('COMPLETED', PaymentStatus.COMPLETED)
            .setParameter('PENDING', PaymentStatus.PENDING)
            .getRawOne();  // Fetch a single aggregated result
    }

    async getPendingPaymentsForTable(req: BranchChartDto) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.amount AS totalPayment',
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'br.name AS branchName',
                'wa.work_status AS WorkStatus',
                'wa.payment_status AS paymentStatus',
                'YEAR(wa.date) AS year',
                'MONTH(wa.date) AS month'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = wa.branch_id')
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('wa.payment_status = :PENDING', { PENDING: PaymentStatus.PENDING }); // Filter only pending payments

        // Extract year and month from req.date if provided
        if (req.date) {
            const dateObj = new Date(req.date);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1; // getMonth() is 0-based, so add 1

            query.andWhere('YEAR(wa.date) = :year', { year });
            query.andWhere('MONTH(wa.date) = :month', { month });
        }

        if (req.branchName) {
            query.andWhere('LOWER(br.name) = LOWER(:branchName)', { branchName: req.branchName });
        }

        return query.getRawMany(); // Fetch the pending payment records
    }

    async getSucessPaymentsForTable(req: BranchChartDto) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.amount AS totalPayment',
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'br.name AS branchName',
                'wa.work_status AS WorkStatus',
                'wa.payment_status AS paymentStatus',
                'YEAR(wa.date) AS year',
                'MONTH(wa.date) AS month'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = wa.branch_id')
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('wa.payment_status = :COMPLETED', { COMPLETED: PaymentStatus.COMPLETED }); // Filter only pending payments

        // Extract year and month from req.date if provided
        if (req.date) {
            const dateObj = new Date(req.date);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1; // getMonth() is 0-based, so add 1

            query.andWhere('YEAR(wa.date) = :year', { year });
            query.andWhere('MONTH(wa.date) = :month', { month });
        }

        if (req.branchName) {
            query.andWhere('LOWER(br.name) = LOWER(:branchName)', { branchName: req.branchName });
        }

        return query.getRawMany(); // Fetch the pending payment records
    }

    async getAllPaymentsForTable(req: BranchChartDto) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.amount AS totalPayment',
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'br.name AS branchName',
                'wa.work_status AS WorkStatus',
                'wa.payment_status AS paymentStatus',
                'YEAR(wa.date) AS year',
                'MONTH(wa.date) AS month'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = wa.branch_id')
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        // ✅ Extract year and month from req.date (if valid)
        if (req.date) {
            const dateObj = new Date(req.date);
            if (!isNaN(dateObj.getTime())) {  // Check if valid date
                const year = dateObj.getFullYear();
                const month = dateObj.getMonth() + 1; // getMonth() is 0-based, so add 1

                query.andWhere('YEAR(wa.date) = :year', { year });
                query.andWhere('MONTH(wa.date) = :month', { month });
            }
        }

        // ✅ Trim and lowercase branchName for case-insensitive comparison
        if (req.branchName) {
            query.andWhere('LOWER(br.name) = LOWER(:branchName)', { branchName: req.branchName.trim() });
        }

        return query.getRawMany(); // Fetch the payment records
    }


    async getUpCommingWorkAllocationDetails(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
    }) {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        const query = this.createQueryBuilder('wa')
            .select([
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'wa.name AS clientName',
                'wa.phone_number AS clientPhoneNumber',
                'wa.address AS clientAddress',
                'wa.description AS description',
                'wa.product_name AS productName',
                'YEAR(wa.date) AS year',
                `FLOOR((DATEDIFF(wa.date, :today) / 7) + 1) AS weekNumber` // Adjusted week calculation
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.date BETWEEN :today AND DATE_ADD(:today, INTERVAL 4 WEEK)', { today })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId });

        if (req.companyCode) {
            query.andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode });
        }

        if (req.unitCode) {
            query.andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });
        }

        query.groupBy('wa.staff_id, staff.name, wa.name, wa.phone_number, wa.address, wa.description, wa.product_name, YEAR(wa.date), weekNumber');

        const result = await query.getRawMany();
        console.log(result, "{{{{{{{{{");
        return result;
    }



}