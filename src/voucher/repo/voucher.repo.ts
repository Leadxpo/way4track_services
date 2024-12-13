import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { VoucherEntity } from "../entity/voucher.entity";
import { VoucherTypeEnum } from "../enum/voucher-type-enum";
import { BranchChartDto } from "../dto/balance-chart.dto";
import { ProductType } from "src/product/dto/product-type.enum";
import { VoucherIDResDTo } from "../dto/voucher-id.res.dto";


@Injectable()

export class VoucherRepository extends Repository<VoucherEntity> {

    constructor(private dataSource: DataSource) {
        super(VoucherEntity, dataSource.createEntityManager());
    }

    async getInVoiceData() {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS InVoiceId',
                've.name AS name',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                've.expire_date AS expireDate',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
            ])
            .leftJoin('ve.client', 'cl')
            .leftJoin('ve.branchId', 'branch')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.INVOICE })
            .getRawMany();

        return query;
    }

    async getDetailInVoiceData(req: VoucherIDResDTo) {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS InVoiceId',
                've.name AS name',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                've.expire_date AS expireDate',
                've.payment_status AS paymentStatus',
                'cl.phone_number AS phoneNumber',
                'cl.email AS email',
                'cl.address AS address',
                'pr.product_name AS productName',
                'pr.product_description AS productDescription',
                'pr.price AS productPrice',
            ])
            .leftJoin('ve.client', 'cl')
            .leftJoin('ve.product', 'pr')
            .leftJoin('ve.branchId', 'branch')
            .where(`'ve.voucher_id = "${req.voucherId}"`)
            .andWhere('ve.voucher_type = :type', { type: VoucherTypeEnum.INVOICE })
            .groupBy('ve.voucher_id')
            .addGroupBy('cl.name')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .getRawOne();

        return query;
    }

    async getReceiptData() {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS receiptId',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                'cl.name AS clientName',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                'branch.name AS branchName',
            ])
            .leftJoin('ve.branchId', 'branch')
            .leftJoin('ve.client', 'cl')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.RECEIPT })
            .getRawMany();
        return query;
    }

    async getPaymentData() {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS paymentId',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                've.payment_to AS paymentTo',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
            ])
            .leftJoin('ve.client', 'cl')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PAYMENT })
            .getRawMany();

        return query;
    }

    async getPurchaseData() {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS purchaseId',
                'br.name AS branchName',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                'vn.name AS vendorName',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
            ])
            .leftJoin('ve.branchId', 'br')
            .leftJoin('ve.vendor', 'vn')
            .leftJoin('ve.client', 'cl')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .getRawMany();

        return query;
    }

    async getLedgerData() {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS ledgerId',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                'branch.name AS branchName',
                'SUM(ve.credit_amount) - SUM(ve.debit_amount) AS balanceAmount',
            ])
            .leftJoin('ve.branchId', 'branch')
            .leftJoin('ve.client', 'cl')
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .groupBy('ve.voucher_id')
            .addGroupBy('cl.name')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_status')
            .getRawMany();

        return query;
    }

    async getDetailLedgerData(req: VoucherIDResDTo) {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS voucherId',
                've.name AS name',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                've.expire_date AS expireDate',
                've.payment_status AS paymentStatus',
                'cl.phone_number AS phoneNumber',
                'cl.email AS email',
                'cl.address AS address',
                've.debit_amount AS debitAmount',
                've.credit_amount AS creditAmount',
                've.purpose AS purpose',
                'branch.name AS branchName',
            ])
            .leftJoin('ve.client', 'cl')
            .leftJoin('ve.branchId', 'branch')
            .where(`ve.voucher_id = "${req.voucherId}"`)
            .andWhere('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .groupBy('ve.voucher_id')
            .addGroupBy('cl.name')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.expire_date')
            .addGroupBy('ve.payment_status')
            .addGroupBy('cl.phone_number')
            .addGroupBy('cl.email')
            .addGroupBy('cl.address')
            .addGroupBy('ve.debit_amount')
            .addGroupBy('ve.credit_amount')
            .addGroupBy('ve.purpose')
            .getRawOne();

        return query;
    }

    async getMonthWiseBalance(req: BranchChartDto) {
        const query = this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
                `MONTH(ve.generation_date) AS month`,
                `MONTHNAME(ve.generation_date) AS monthName`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`
            ])
            .leftJoin('ve.branchId', 'branch')
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date), MONTHNAME(ve.generation_date)');

        const result = await query.getRawMany();
        return result;

    }
    async getYearWiseCreditAndDebitPercentages(req: BranchChartDto) {
        const query = this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
                `ve.product_type AS productType`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `ROUND(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) / SUM(ve.amount) * 100, 2) AS creditPercentage`,
                `ROUND(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) / SUM(ve.amount) * 100, 2) AS debitPercentage`,
            ])
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE]
            })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .groupBy('YEAR(ve.generation_date), ve.product_type')
            .orderBy('YEAR(ve.generation_date), ve.product_type')
            .getRawMany();

        return query;
    }

    async getDayBookData(req: BranchChartDto) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS date`,
                `ve.voucher_id AS voucherId`,
                `ve.product_type AS productType`,
                `ve.voucher_type AS voucherType`,
                `ve.purpose AS purpose`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(
                    CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END
                ) - 
                SUM(
                    CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END
                ) AS balanceAmount`
            ])
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE],
            })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date.split('-')[0] })
            .andWhere(`MONTH(ve.generation_date) = :month`, { month: req.date.split('-')[1] })
            .groupBy(
                `YEAR(ve.generation_date), 
                MONTH(ve.generation_date), 
                ve.product_type, 
                DATE(ve.generation_date), 
                ve.voucher_id, 
                ve.voucher_type, 
                ve.purpose`
            )
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .addOrderBy('ve.product_type', 'ASC')
            .getRawMany();

        return query;
    }



    async getPurchaseCount(): Promise<any> {
        const query = this.createQueryBuilder('ve')
            .select('COUNT(ve.voucher_id) AS totalPurchases')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('DATE(ve.generation_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()');

        const last30DaysResult = await query.getRawOne();
        const weekQuery = this.createQueryBuilder('ve')
            .select('COUNT(ve.voucher_id) AS totalPurchases')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('DATE(ve.generation_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()');
        const last7DaysResult = await weekQuery.getRawOne();
        const last30DaysPurchases = last30DaysResult.totalPurchases;
        const last7DaysPurchases = last7DaysResult.totalPurchases;

        let percentageChange = 0;
        if (last7DaysPurchases && last30DaysPurchases) {
            percentageChange = ((last30DaysPurchases - last7DaysPurchases) / last7DaysPurchases) * 100;
        }

        return {
            last30DaysPurchases: last30DaysPurchases,
            percentageChange: percentageChange.toFixed(2),
        };
    }

    async getExpenseData(): Promise<any> {
        const query = this.createQueryBuilder('ve')
            .select('SUM(ve.amount) AS totalExpenses')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('ve.product_type = :productType', { productType: ProductType.expanses })
            .andWhere('DATE(ve.generationDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()');
        const last30DaysResult = await query.getRawOne();
        const weekQuery = this.createQueryBuilder('ve')
            .select('SUM(ve.amount) AS totalExpenses')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('ve.product_type = :productType', { productType: ProductType.expanses })
            .andWhere('DATE(ve.generationDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()');
        const last7DaysResult = await weekQuery.getRawOne();
        const last30DaysExpenses = last30DaysResult.totalExpenses;
        const last7DaysExpenses = last7DaysResult.totalExpenses;
        let percentageChange = 0;
        if (last7DaysExpenses && last30DaysExpenses) {
            percentageChange = ((last30DaysExpenses - last7DaysExpenses) / last7DaysExpenses) * 100;
        }

        return {
            last30DaysExpenses: last30DaysExpenses,
            percentageChange: percentageChange.toFixed(2),
        };
    }

    async getLast30DaysCreditAndDebitPercentages() {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS date`,
                `ve.product_type AS productType`,
                `branch.name AS branchName`,
                `branch.manager_name AS managerName`,
                `branch.branch_number AS branchNumber`,
                `branch.branch_address AS branchAddress`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `ROUND(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) / NULLIF(SUM(ve.amount), 0) * 100, 2) AS creditPercentage`,
                `ROUND(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) / NULLIF(SUM(ve.amount), 0) * 100, 2) AS debitPercentage`
            ])
            .leftJoin('branch', 'branch', 'branch.id = ve.branch_id') // Corrected join syntax
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE]
            })
            .andWhere('ve.generation_date >= CURDATE() - INTERVAL 30 DAY')
            .groupBy(
                `DATE(ve.generation_date), 
                ve.product_type, 
                branch.name, 
                branch.manager_name, 
                branch.branch_number, 
                branch.branch_address`
            )
            .orderBy(
                `DATE(ve.generation_date)`, 'ASC'
            )
            .addOrderBy('ve.product_type', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .addOrderBy('branch.branch_number', 'ASC')
            .getRawMany();

        return query;
    }




}