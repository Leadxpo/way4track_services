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
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
import { ServiceTypeEntity } from "src/service-type/entity/service.entity";
import { ProductTypeEntity } from "src/product-type/entity/product-type.entity";
import { SubDelaerStaffEntity } from "src/sub-dealer-staff/entity/sub-dealer-staff.entity";



@Injectable()

export class TechinicianWoksRepository extends Repository<TechnicianWorksEntity> {

    constructor(private dataSource: DataSource) {
        super(TechnicianWorksEntity, dataSource.createEntityManager());
    }

    async getTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        date?: string; // Logged-in staff ID
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'DATE_FORMAT(wa.start_date, "%Y-%m") AS date',
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'COUNT(wa.id) AS totalAppointments',
                'SUM(CASE WHEN wa.work_status = :pending THEN 1 ELSE 0 END) AS totalPendingAppointments',
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessAppointments'
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.staff_id = :staffId', { staffId: req.staffId });

        if (req.companyCode) {
            query.andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode });
        }

        if (req.unitCode) {
            query.andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });
        }

        if (req.date) {
            query.andWhere('DATE_FORMAT(wa.start_date, "%Y-%m") = :date', { date: req.date });
        }

        query
            .groupBy('DATE_FORMAT(wa.start_date, "%Y-%m")')
            .addGroupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .setParameter('completed', WorkStatusEnum.COMPLETED)
            .setParameter('pending', WorkStatusEnum.PENDING);

        return await query.getRawMany();
    }


    async getPaymentWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string;
        staffId: string;
        date?: string; // Logged-in staff ID
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'DATE_FORMAT(wa.start_date, "%Y-%m") AS date',
                'wa.staff_id AS staffId',
                'staff.name AS staffName',
                'SUM(CASE WHEN wa.payment_status = :PENDING THEN 1 ELSE 0 END) AS totalPendingPayment',
                'SUM(CASE WHEN wa.payment_status = :COMPLETED THEN 1 ELSE 0 END) AS totalSuccessPayment'
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
        if (req.date) {
            query.where('DATE_FORMAT(wa.start_date, "%Y-%m") = :date', { date: req.date })

        }
        query.groupBy('DATE_FORMAT(wa.start_date, "%Y-%m")') // Group by formatted date
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
                'YEAR(wa.start_date) AS year',
                `(DATEDIFF(wa.start_date, :today) DIV 7) + 1 AS weekNumber`, // Adjusted week calculation
                'COUNT(wa.id) AS totalTickets',
                `SUM(CASE WHEN wa.work_status = 'pending' THEN 1 ELSE 0 END) AS totalPendingTickets`, // Fixed issue
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.start_date BETWEEN :today AND DATE_ADD(:today, INTERVAL 4 WEEK)', { today })
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .addGroupBy('YEAR(wa.start_date)')
            .addGroupBy(`(DATEDIFF(wa.start_date, :today) DIV 7) + 1`); // Ensure correct week grouping

        const result = await query.getRawMany();
        console.log(result, "{{{{{{{{{");
        return result;
    }

    async getStaffWorkAllocation(req: {
        staffId: string; companyCode?: string;
        unitCode?: string; status?: string
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.id as id',
                'wa.service AS service',
                'wa.payment_status AS paymentStatus',
                'wa.start_date AS startDate',
                'staff.name AS staffName',
                'staff.id as staffId',
                'st.id as backSupporterId',
                'wa.client_id as WaclientId',
                'wa.email as email',
                'wa.address as address',
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
                'wa.vehicle_photo_5 as vehiclePhoto5',
                'wa.vehicle_photo_6 as vehiclePhoto6',
                'wa.vehicle_photo_7 as vehiclePhoto7',
                'wa.vehicle_photo_8 as vehiclePhoto8',
                'wa.vehicle_photo_9 as vehiclePhoto9',
                'wa.vehicle_photo_10 as vehiclePhoto10',
                'wa.screen_shot as screenShot',
                'wa.description as description',
                'wa.name as clientName',
                'wa.phone_number as phoneNumber',
                'wa.sim_number as simNumber',
                'st.name AS backSupportterName',
                'st.phone_number AS backSupportterPhoneNumber',
                'st.email AS backSupportterNameEmail',
                'wa.amount as amount',
                'wa.end_date AS endDate',
                'wa.installation_address as installationAddress',
                'wa.technician_number as technicianNumber',
                'wa.accept_start_date as acceptStartDate',
                'wa.activate_date as activateDate',
                'wa.pending_date as pendingDate',
                'wa.completed_date as completedDate',
                'sb .name as subDealerName',
                'sb.sub_dealer_id as subDealerId',
                'sb.sub_dealer_phone_number as subDealerPhoneNumber',
                'wa.remark as remark',
                'br.id as branchId',
                'br.id AS branchId',
                'pt.name as applicationName',
                'wa.user_name as userName',
                'wa.paid_amount as paidAmount'

            ])
            .leftJoinAndSelect(StaffEntity, 'st', 'st.id = wa.back_supporter_id')
            .leftJoinAndSelect(StaffEntity, 'staff', 'staff.id = wa.staff_id')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = wa.sub_dealer_id')
            .leftJoin(ProductTypeEntity, 'pt', 'pt.id = wa.application_id')
            .leftJoinAndSelect(BranchEntity, 'br', 'staff.branch_id = br.id')
            .leftJoinAndSelect(ClientEntity, 'client', 'wa.client_id = client.id')
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode }) // Changed to .andWhere()
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.status) {
            query.andWhere(`wa.work_status=:status`, { status: req.status })
        }
        query.orderBy('wa.start_date', 'ASC')

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
                'DATE(wa.start_date) AS workDate', // Grouping by day
                'COUNT(wa.id) AS totalTickets'
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.start_date BETWEEN :today AND DATE_ADD(:today, INTERVAL 6 DAY)', {
                today: new Date().toISOString().split('T')[0]
            }) // Fetch work counts for the next 7 days (one week)
            .andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .addGroupBy('DATE(wa.start_date)'); // Grouping by date ensures daily breakdown

        const result = await query.getRawMany();
        return result;
    }

    //New APIS--------------------------------------
    async getPaymentStatusPayments(req: BranchChartDto) {
        const query = this.createQueryBuilder('wa')
            .select([
                'COALESCE(SUM(wa.amount), 0) AS "totalPayment"',
                'COALESCE(SUM(CASE WHEN wa.payment_status = :PENDING THEN wa.amount ELSE 0 END), 0) AS "totalPendingPayment"',
                'COALESCE(SUM(CASE WHEN wa.payment_status = :COMPLETED THEN wa.amount ELSE 0 END), 0) AS "totalSuccessPayment"',
            ])

            .leftJoin(BranchEntity, 'br', 'br.id = wa.branch_id')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = wa.sub_dealer_id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.date) {
            const dateObj = new Date(req.date);
            if (!isNaN(dateObj.getTime())) {  // Check if valid date
                const year = dateObj.getFullYear();
                const month = dateObj.getMonth() + 1; // getMonth() is 0-based, so add 1

                query.andWhere('YEAR(wa.start_date) = :year', { year });
                query.andWhere('MONTH(wa.start_date) = :month', { month });
            }
        }
        if (req.branchName) {
            query.andWhere(`LOWER(br.name) = LOWER(:branchName)`, { branchName: req.branchName });
        }

        if (req.subDealerId) {
            query.andWhere(`sb.sub_dealer_id=:subDealerId`, { subDealerId: req.subDealerId })
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
                'YEAR(wa.start_date) AS year',
                'MONTH(wa.start_date) AS month'
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

            query.andWhere('YEAR(wa.start_date) = :year', { year });
            query.andWhere('MONTH(wa.start_date) = :month', { month });
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
                'YEAR(wa.start_date) AS year',
                'MONTH(wa.start_date) AS month'
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

            query.andWhere('YEAR(wa.start_date) = :year', { year });
            query.andWhere('MONTH(wa.start_date) = :month', { month });
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
                'YEAR(wa.start_date) AS year',
                'MONTH(wa.start_date) AS month'
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

                query.andWhere('YEAR(wa.start_date) = :year', { year });
                query.andWhere('MONTH(wa.start_date) = :month', { month });
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
                'YEAR(wa.start_date) AS year',
                `FLOOR((DATEDIFF(wa.start_date, :today) / 7) + 1) AS weekNumber` // Adjusted week calculation
            ])
            .leftJoin(StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .where('wa.start_date BETWEEN :today AND DATE_ADD(:today, INTERVAL 4 WEEK)', { today })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId });

        if (req.companyCode) {
            query.andWhere('wa.company_code = :companyCode', { companyCode: req.companyCode });
        }

        if (req.unitCode) {
            query.andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });
        }

        query.groupBy('wa.staff_id, staff.name, wa.name, wa.phone_number, wa.address, wa.description, wa.product_name, YEAR(wa.start_date), weekNumber');

        const result = await query.getRawMany();
        console.log(result, "{{{{{{{{{");
        return result;
    }


    async getClientDataForTechniciansTable(req: {
        clientId?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                'cl.name AS clientName',
                'cl.phone_number AS phoneNumber',
                'cl.client_id AS clientId',
                'cl.address AS address',
                've.service AS service',
                've.payment_status AS paymentStatus',
                've.start_date AS date',
                'staff.name AS staffName',
                've.end_date AS attendedDate',
                've.description AS description',
                've.product_name AS productName',
                've.work_status AS workStatus',
                'SUM(ve.amount) AS totalAmount',
                've.id AS id'
            ])
            .leftJoin(StaffEntity, 'staff', 've.staff_id = staff.id')
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        // Add condition for clientId only if provided
        if (req.clientId) {
            query.andWhere('cl.client_id = :clientId', { clientId: req.clientId });
        }

        // Grouping to aggregate SUM(ve.amount)
        query.groupBy('cl.client_id')
            .addGroupBy('cl.name')
            .addGroupBy('cl.phone_number')
            .addGroupBy('cl.address')
            .addGroupBy('ve.service')
            .addGroupBy('ve.payment_status')
            .addGroupBy('ve.start_date')
            .addGroupBy('staff.name')
            .addGroupBy('ve.end_date')
            .addGroupBy('ve.description')
            .addGroupBy('ve.product_name')
            .addGroupBy('ve.work_status')
            .addGroupBy('ve.id');

        const result = await query.getRawMany();
        return result;
    }

    async getClientDataForTablePhoneNumber(req: {
        phoneNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've',
                've.name AS clientName',
                've.phone_number AS phoneNumber',
                've.address AS address',
                've.service AS service',
                've.payment_status AS paymentStatus',
                've.start_date AS date',
                'staff.name AS staffName',
                've.end_date AS attendedDate',
                've.description AS description',
                've.product_name AS productName',
                've.work_status AS workStatus',
                'SUM(ve.amount) AS totalAmount',
                've.id AS id',
                've.technician_number as technicianNumber',
                've.remark as remark',
                've.paid_amount as paidAmount',
                've.user_name as userName',
                'pt.name as applicationName',
            ])
            .leftJoinAndSelect(StaffEntity, 'staff', 've.staff_id = staff.id')
            .leftJoinAndSelect(ProductTypeEntity, 'pt', 'pt.id = ve.application_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.phoneNumber) {
            query.andWhere('ve.phone_number = :phoneNumber', { phoneNumber: req.phoneNumber });
        }

        query.groupBy('ve.name')
            .addGroupBy('ve.phone_number')
            .addGroupBy('ve.address')
            .addGroupBy('ve.service')
            .addGroupBy('ve.payment_status')
            .addGroupBy('ve.start_date')
            .addGroupBy('staff.name')
            .addGroupBy('ve.end_date')
            .addGroupBy('ve.description')
            .addGroupBy('ve.product_name')
            .addGroupBy('ve.work_status')
            .addGroupBy('ve.id')
            .addGroupBy('ve.technician_number');

        const result = await query.getRawMany();
        return result;
    }

    async getBackendSupportWorkAllocation(req: {
        staffId?: string;
        subDealerId?: string;
        supporterId?: string;
        companyCode?: string;
        unitCode?: string;
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        status?: string;
    }) {
        const query = this.createQueryBuilder('wa')
            .select([
                'wa.id as id',
                'wa.service AS service',
                'wa.payment_status AS paymentStatus',
                'wa.start_date AS startDate',
                'staff.name AS staffName',
                'st.name AS backSupportterName',
                'st.phone_number AS backSupportterPhoneNumber',
                'st.email AS backSupportterNameEmail',
                'wa.email as email',
                'wa.address as address',
                'wa.work_status as workStatus',
                'wa.product_name as productName',
                'wa.imei_number as imeiNumber',
                'wa.vehicle_type as vehicleType',
                'wa.vehicle_number as vehicleNumber',
                'wa.chassis_number as chassisNumber',
                'wa.engine_number as engineNumber',
                'wa.description as description',
                'wa.name as clientName',
                'wa.phone_number as phoneNumber',
                'wa.sim_number as simNumber',
                'wa.end_date AS endDate',
                'wa.service_or_product AS serviceOrProduct',
                'br.name AS branchName',
                'br.id AS branchId',
                'staff.id as staffId',
                'st.id as backSupporterId',
                'wa.amount as amount',
                'wa.vehicle_photo_1 as vehiclePhoto1',
                'wa.vehicle_photo_2 as vehiclePhoto2',
                'wa.vehicle_photo_3 as vehiclePhoto3',
                'wa.vehicle_photo_4 as vehiclePhoto4',
                'wa.vehicle_photo_5 as vehiclePhoto5',
                'wa.vehicle_photo_6 as vehiclePhoto6',
                'wa.vehicle_photo_7 as vehiclePhoto7',
                'wa.vehicle_photo_8 as vehiclePhoto8',
                'wa.vehicle_photo_9 as vehiclePhoto9',
                'wa.vehicle_photo_10 as vehiclePhoto10',
                'wa.installation_address as installationAddress',
                'wa.technician_number as technicianNumber',
                'wa.accept_start_date as acceptStartDate',
                'wa.activate_date as activateDate',
                'wa.pending_date as pendingDate',
                'wa.pending_date as pendingDate',
                'wa.pending_date as pendingDate',
                'wa.completed_date as completedDate',
                'sb .name as subDealerName',
                'sb.sub_dealer_id as subDealerId',
                'sb.sub_dealer_phone_number as subDealerPhoneNumber',
                'subst.staff_id as subDealerStaffId',
                'wa.remark as remark',
                'wa.paid_amount as paidAmount'
            ])
            .leftJoin(StaffEntity, 'staff', 'staff.id = wa.staff_id')
            .leftJoin(StaffEntity, 'st', 'st.id = wa.back_supporter_id')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = wa.sub_dealer_id')
            .leftJoin(SubDelaerStaffEntity, 'subst', 'subst.id = wa.sub_dealer_staff_id')
            .leftJoin(BranchEntity, 'br', 'br.id = wa.branch_id')
            .leftJoin(ClientEntity, 'client', 'wa.client_id = client.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
        // Apply filters only if values are provided
        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }
        if (req.supporterId) {
            query.andWhere('st.staff_id = :supporterId', { supporterId: req.supporterId });
        }

        if (req.fromDate && req.toDate) {
            query.andWhere('wa.start_date BETWEEN :fromDate AND :toDate', {
                fromDate: req.fromDate,
                toDate: req.toDate,
            });
        }
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        if (req.status) {
            query.andWhere(`wa.work_status=:status`, { status: req.status })
        }

        if (req.subDealerId) {
            query.andWhere(`sb.sub_dealer_id=:subDealerId`, { subDealerId: req.subDealerId })
        }
        query.orderBy('wa.start_date', 'ASC')
        return await query.getRawMany();
    }

    async getWorkStatusCards(req: { companyCode: string; unitCode: string; date?: string }) {
        const baseQuery = this.createQueryBuilder('wa')
            .leftJoin(BranchEntity, 'br', 'br.id = wa.branch_id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        const baseQuery1 = this.createQueryBuilder('wa')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = wa.sub_dealer_id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.date) {
            baseQuery.andWhere('wa.start_date = :date', { date: req.date });
        }

        const overallQuery = baseQuery.clone()
            .select([
                'SUM(CASE WHEN wa.work_status = :install THEN 1 ELSE 0 END) AS totalInstallWork',
                'SUM(CASE WHEN wa.work_status = :accept THEN 1 ELSE 0 END) AS totalAcceptWork',
                'SUM(CASE WHEN wa.work_status = :activate THEN 1 ELSE 0 END) AS totalActivateWork',
                'SUM(CASE WHEN wa.work_status = :pending THEN 1 ELSE 0 END) AS totalPendingWork',
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalCompletedWork',
            ]);

        const branchWiseQuery = baseQuery.clone()
            .select([
                'br.name AS branchName',
                'SUM(CASE WHEN wa.work_status = :install THEN 1 ELSE 0 END) AS totalInstallWork',
                'SUM(CASE WHEN wa.work_status = :accept THEN 1 ELSE 0 END) AS totalAcceptWork',
                'SUM(CASE WHEN wa.work_status = :activate THEN 1 ELSE 0 END) AS totalActivateWork',
                'SUM(CASE WHEN wa.work_status = :pending THEN 1 ELSE 0 END) AS totalPendingWork',
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalCompletedWork',
            ])
            .groupBy('br.name');

        const branchWiseQuery1 = baseQuery1.clone()
            .select([
                'sb.sub_dealer_id AS subDealerId',
                'SUM(CASE WHEN wa.work_status = :install THEN 1 ELSE 0 END) AS totalInstallWork',
                'SUM(CASE WHEN wa.work_status = :accept THEN 1 ELSE 0 END) AS totalAcceptWork',
                'SUM(CASE WHEN wa.work_status = :activate THEN 1 ELSE 0 END) AS totalActivateWork',
                'SUM(CASE WHEN wa.work_status = :pending THEN 1 ELSE 0 END) AS totalPendingWork',
                'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalCompletedWork',
            ])
            .groupBy('sb.sub_dealer_id');

        const params = {
            install: WorkStatusEnum.INSTALL,
            accept: WorkStatusEnum.ACCEPT,
            activate: WorkStatusEnum.ACTIVATE,
            pending: WorkStatusEnum.PENDING,
            completed: WorkStatusEnum.COMPLETED,
        };

        const [overall, branchWise, subDealer] = await Promise.all([
            overallQuery.setParameters(params).getRawOne(),
            branchWiseQuery.setParameters(params).getRawMany(),
            branchWiseQuery1.setParameters(params).getRawMany()
        ]);


        return {
            overall: {
                totalInstallWork: overall?.totalInstallWork || 0,
                totalAcceptWork: overall?.totalAcceptWork || 0,
                totalActivateWork: overall?.totalActivateWork || 0,
                totalPendingWork: overall?.totalPendingWork || 0,
                totalCompletedWork: overall?.totalCompletedWork || 0,
            },
            branchWise: branchWise || [],
            subDealer: subDealer || []
        };


    }

    async getSubDealerServiceTypesCards(req: {
        companyCode: string;
        unitCode: string;
        fromDate?: string;
        toDate?: string;
    }) {
        const query = this.createQueryBuilder('wa')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = wa.sub_dealer_id')
            .leftJoin(ServiceTypeEntity, 'st', 'st.id = wa.service_id')
            .select([
                'sb.id AS subDealerId',
                'sb.name AS subDealerName',
                'st.name AS serviceName',
                'COUNT(*) AS totalServices',
                'SUM(CAST(wa.amount AS float)) AS totalAmount'
            ])
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('wa.start_date >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('wa.end_date <= :toDate', { toDate: req.toDate });
        }

        query.groupBy('sb.id')
            .addGroupBy('sb.name')
            .addGroupBy('st.name');

        const result = await query.getRawMany();

        // Optional: group into nested structure in JS
        const groupedResult = result.reduce((acc, row) => {
            const subDealerId = row.subDealerId;
            if (!acc[subDealerId]) {
                acc[subDealerId] = {
                    subDealerId,
                    subDealerName: row.subDealerName,
                    services: []
                };
            }

            acc[subDealerId].services.push({
                serviceName: row.serviceName,
                totalServices: +row.totalServices,
                totalAmount: +row.totalAmount
            });

            return acc;
        }, {} as Record<string, any>);

        return Object.values(groupedResult);
    }

    async getSubDealerPendingPayments(req: {
        subDealerId?: number;
    }) {
        const query = this.createQueryBuilder('wa')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = wa.sub_dealer_id')
            .select([
                'SUM(CASE WHEN wa.work_status = :accept THEN 1 ELSE 0 END) AS totalActivateWork',
                'SUM(CASE WHEN wa.payment_status = :pending THEN 1 ELSE 0 END) AS totalPendingWork',
                'SUM(CAST(wa.amount AS float)) AS totalAmount'
            ])
            .andWhere('sb.id = :subDealerId', { subDealerId: req.subDealerId });

        const params = {
            accept: WorkStatusEnum.ACCEPT,
            pending: PaymentStatus.PENDING,
        };

        const [subDealer] = await Promise.all([
            query.setParameters(params).getRawOne()
        ]);

        return {
            subDealer: subDealer || []
        };
    }

    async getJobCompleted(req: { companyCode: string; unitCode: string; date?: string }) {
        const baseQuery = this.createQueryBuilder('wa')
            .leftJoin(BranchEntity, 'br', 'br.id = wa.branch_id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        const baseQuery1 = this.createQueryBuilder('wa')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = wa.sub_dealer_id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.date) {
            baseQuery.andWhere('wa.activate_date = :date', { date: req.date });
            baseQuery1.andWhere('wa.activate_date = :date', { date: req.date });
        }
        const overallQuery = baseQuery.clone()
            .select([

                'SUM(CASE WHEN wa.work_status = :activate THEN 1 ELSE 0 END) AS totalActivateWork',

            ]);

        const branchWiseQuery = baseQuery.clone()
            .select([
                'br.name AS branchName',

                'SUM(CASE WHEN wa.work_status = :activate THEN 1 ELSE 0 END) AS totalActivateWork',

            ])
            .groupBy('br.name');

        const branchWiseQuery1 = baseQuery1.clone()
            .select([
                'sb.sub_dealer_id AS subDealerId',

                'SUM(CASE WHEN wa.work_status = :activate THEN 1 ELSE 0 END) AS totalActivateWork',

            ])
            .groupBy('sb.sub_dealer_id');

        const params = {
            activate: WorkStatusEnum.ACTIVATE,
        };

        const [overall, branchWise, subDealer] = await Promise.all([
            overallQuery.setParameters(params).getRawOne(),
            branchWiseQuery.setParameters(params).getRawMany(),
            branchWiseQuery1.setParameters(params).getRawMany()
        ]);


        return {
            overall: {

                totalActivateWork: overall?.totalActivateWork || 0,

            },
            branchWise: branchWise || [],
            subDealer: subDealer || []
        };


    }

}