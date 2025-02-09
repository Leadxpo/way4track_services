import { Injectable } from "@nestjs/common";
import { AccountEntity } from "src/account/entity/account.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { EstimateEntity } from "src/estimate/entity/estimate.entity";
import { CommonReq } from "src/models/common-req";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { ProductType } from "src/product/dto/product-type.enum";
import { ProductEntity } from "src/product/entity/product.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { Brackets, DataSource, Repository } from "typeorm";
import { BranchChartDto } from "../dto/balance-chart.dto";
import { InvoiceDto } from "../dto/invoice.dto";
import { VoucherIDResDTo } from "../dto/voucher-id.res.dto";
import { VoucherEntity } from "../entity/voucher.entity";
import { VoucherTypeEnum } from "../enum/voucher-type-enum";
@Injectable()

export class VoucherRepository extends Repository<VoucherEntity> {

    constructor(private dataSource: DataSource) {
        super(VoucherEntity, dataSource.createEntityManager());
    }

    async getInVoiceData(req: InvoiceDto) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS ReciptId',
                'es.invoice_id as InvoiceId',
                've.name AS name',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                'es.estimate_date as estimateDate',
                'es.expire_date AS expireDate',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
            ])
            .leftJoinAndSelect(ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoinAndSelect(EstimateEntity, 'es', 've.invoice_id = es.invoice_id')
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
        if (req.fromDate && req.toDate) {
            query.andWhere('ve.generation_date BETWEEN :fromDate AND :toDate', {
                fromDate: req.fromDate,
                toDate: req.toDate,
            });
        }
        if (req.paymentStatus) {
            query.andWhere('ve.payment_status = :paymentStatus', {
                paymentStatus: req.paymentStatus,
            });
        }

        const result = await query.getRawMany();
        return result;
    }

    async getDetailInVoiceData(req: VoucherIDResDTo) {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS ReciptId',
                'es.invoice_id as InvoiceId',
                've.name AS name',
                'cl.name AS clientName',
                'es.estimate_date as estimateDate',
                'es.expire_date AS expireDate',
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
            .leftJoinAndSelect(ClientEntity, 'cl', 'cl.client_id = ve.id')
            .leftJoinAndSelect(EstimateEntity, 'es', 've.invoice_id = es.invoice_id')
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(ProductEntity, 'pr', 've.product=pr.id')
            .where('es.invoice_id = :inVoiceId', { inVoiceId: req.inVoiceId })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .groupBy('ve.voucher_id')
            .addGroupBy('cl.name')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.name')
            .addGroupBy('cl.phone_number')
            .addGroupBy('cl.email')
            .addGroupBy('cl.address')
            .addGroupBy('pr.product_name')
            .addGroupBy('pr.product_description')
            .addGroupBy('pr.price')
            .addGroupBy('ve.expire_date')
            .addGroupBy('ve.payment_status')
            .addGroupBy('es.estimate_date') // Add this line
            .addGroupBy('es.expire_date')   // If needed, add this too
            .getRawOne();

        return query;



    }

    async getReceiptDataForReport(filters: {
        voucherId?: string; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS receiptId',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                'cl.name AS clientName',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                'branch.name AS branchName',
            ])
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(ClientEntity, 'cl', 've.client_id = cl.id')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.RECEIPT })
            .andWhere(`ve.company_code = "${filters.companyCode}"`)
            .andWhere(`ve.unit_code = "${filters.unitCode}"`)

        query.andWhere('ve.voucher_id = :voucherId', { voucherId: filters.voucherId });

        const result = await query.getRawMany();
        return result;
    }
    async getReceiptData(filters: {
        voucherId?: string; clientName?: string; paymentStatus?: PaymentStatus; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS receiptId',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                'cl.name AS clientName',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                'branch.name AS branchName',
            ])
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(ClientEntity, 'cl', 've.client_id = cl.id')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.RECEIPT })
            .andWhere(`ve.company_code = "${filters.companyCode}"`)
            .andWhere(`ve.unit_code = "${filters.unitCode}"`)
        // Apply filters dynamically
        if (filters.voucherId) {
            query.andWhere('ve.voucher_id = :voucherId', { voucherId: filters.voucherId });
        }

        if (filters.clientName) {
            query.andWhere('cl.name LIKE :clientName', { clientName: `%${filters.clientName}%` });
        }

        if (filters.paymentStatus) {
            query.andWhere('ve.payment_status = :paymentStatus', { paymentStatus: filters.paymentStatus });
        }

        // Execute the query
        const result = await query.getRawMany();
        return result;
    }

    async getPaymentData(filters: {
        fromDate?: Date; toDate?: Date; paymentStatus?: PaymentStatus; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS paymentId',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                'ac.account_name AS paymentTo',
                'ac.account_number AS accountNumber',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
            ])
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoin(AccountEntity, 'ac', 'ac.id=ve.to_account_id')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PAYMENT })
            .andWhere(`ve.company_code = "${filters.companyCode}"`)
            .andWhere(`ve.unit_code = "${filters.unitCode}"`)
        if (filters.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: filters.fromDate });
        }

        if (filters.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: filters.toDate });
        }

        if (filters.paymentStatus) {
            query.andWhere('ve.payment_status = :paymentStatus', { paymentStatus: filters.paymentStatus });
        }

        // Execute the query
        try {
            const result = await query.getRawMany();
            return result;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }

    }

    async getPurchaseData(req: CommonReq) {
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
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .leftJoin(VendorEntity, 'vn', 've.vendor_id=vn.id')
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .getRawMany();

        return query;
    }

    async getLedgerDataTable(req: {
        clientId?: number; branchName?: string; clientName?: string; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                // 'cl.client_id AS clientId',
                'cl.name AS clientName',
                'sb.name AS subDealerName',
                'sb.sub_dealer_id AS subDealerId',
                'vr.name AS vendorName',
                'vr.vendor_id AS vendorId',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                'cl.phone_number AS phoneNumber',
                'cl.email AS email',
                'cl.client_id  as clientId',
                'cl.address AS address',
                'cl.GST_number as GSTNumber',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                'branch.name AS branchName',
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoin(SubDealerEntity, 'sb', 've.sub_dealer_id = sb.id')
            .leftJoin(VendorEntity, 'vr', 've.vendor_id = vr.id')
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
        if (req.clientName) {
            query.andWhere('cl.name = :clientName', { clientName: req.clientName });
        }

        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        if (req.clientId) {
            query.andWhere('cl.client_id = :clientId', { clientId: req.clientId });
        }

        query.groupBy('ve.voucher_id')
            .addGroupBy('cl.name')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_status')
            .addGroupBy('ve.amount');

        const result = await query.getRawMany();
        return result;
    }

    async getLedgerDataById(req: {
        subDealerId?: number; clientId?: number; vendorId?: number; companyCode?: string; unitCode?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS ledgerId',
                'cl.name AS clientName',
                'sb.name AS subDealerName',
                'vr.name AS vendorName',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                'cl.phone_number AS phoneNumber',
                'sb.sub_dealer_id AS subDealerId',
                'cl.client_id  as clientId',
                'vr.vendor_id AS vendorId',
                'cl.email AS clientEmail',
                'cl.address AS clientAddress',
                'cl.client_photo AS clientPhoto',
                'cl.GST_number AS clientGSTNumber',
                'sb.sub_dealer_phone_number AS subDealerPhoneNumber',
                'sb.gst_number AS subDealerGSTNumber',
                'sb.address AS subDealerAddress',
                'sb.sub_dealer_photo AS subDealerPhoto',
                'sb.email AS subDealerEmail',
                'vr.vendor_phone_number AS vendorPhoneNumber',
                'vr.GST_number AS vendorGSTNumber',
                'vr.address AS vendorAddress',
                'vr.vendor_photo AS vendorPhoto',
                'vr.email AS vendorEmail',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                'branch.name AS branchName',
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - 
                 SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoin(SubDealerEntity, 'sb', 've.sub_dealer_id = sb.id')
            .leftJoin(VendorEntity, 'vr', 've.vendor_id = vr.id')
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        // Ensure data is fetched even if only one of the IDs exists in a row
        query.andWhere(
            new Brackets(qb => {
                if (req.clientId) qb.orWhere('ve.client_id = :clientId', { clientId: req.clientId });
                if (req.vendorId) qb.orWhere('ve.vendor_id = :vendorId', { vendorId: req.vendorId });
                if (req.subDealerId) qb.orWhere('ve.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
            })
        );

        query.groupBy('ve.voucher_id');

        const result = await query.getRawMany();
        return result;
    }

    async getLedgerDataForReport(req: {
        fromDate?: string;
        toDate?: string;
        clientName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
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
                'cl.client_photo as clientPhoto',
                'cl.GST_number as GSTNumber',
                've.voucher_type AS voucherType',
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - 
                SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`,
                've.purpose AS purpose',
                'branch.name AS branchName',
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE],
            })
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode });
        if (req.fromDate) {
            query.andWhere(`ve.generation_date >= :fromDate`, { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere(`ve.generation_date<= :toDate`, { toDate: req.toDate });
        }
        if (req.clientName) {
            query.andWhere('cl.name = :clientName', { clientName: req.clientName });
        }
        query.groupBy('ve.voucher_id')
            .addGroupBy('ve.name')
            .addGroupBy('cl.name')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.expire_date')
            .addGroupBy('ve.payment_status')
            .addGroupBy('cl.phone_number')
            .addGroupBy('cl.email')
            .addGroupBy('cl.address')
            .addGroupBy('ve.purpose')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC');
        const data = await query.getRawMany();

        return data;
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
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`,
                've.purpose AS purpose',
                'branch.name AS branchName',
            ])
            .leftJoinAndSelect(ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where(`ve.voucher_id = "${req.voucherId}"`)
            .andWhere('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .groupBy('ve.voucher_id')
            .addGroupBy('ve.name')
            .addGroupBy('cl.name')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.expire_date')
            .addGroupBy('ve.payment_status')
            .addGroupBy('cl.phone_number')
            .addGroupBy('cl.email')
            .addGroupBy('cl.address')
            .addGroupBy('ve.purpose')
            .getRawOne();

        return query;
    }

    async getAllVouchers(req: {
        voucherId?: number; branchName?: string; paymentStatus?: string; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS ledgerId',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                've.name AS voucherName',
                'branch.name AS branchName',
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`,
                've.voucher_type AS voucherType',
            ])
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(ClientEntity, 'cl', 've.client_id = cl.id')
            .where(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
        if (req.voucherId) {
            query.andWhere('ve.voucher_id = :voucherId', { voucherId: req.voucherId });
        }

        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        if (req.paymentStatus) {
            query.andWhere('ve.payment_status = :paymentStatus', { paymentStatus: req.paymentStatus });
        }

        query.groupBy('ve.voucher_id')
            .addGroupBy('cl.name')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_status')
            .addGroupBy('ve.amount')
            .addGroupBy('ve.voucher_type')
            .addGroupBy('ve.name')

        const result = await query.getRawMany();
        return result;
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
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date), MONTHNAME(ve.generation_date)');  // Added MONTHNAME to GROUP BY

        const result = await query.getRawMany();
        return result;

    }

    async getYearWiseCreditAndDebitPercentages(req: BranchChartDto) {
        // Ensure that req.date is treated as a number
        const year = Number(req.date); // Convert to number

        // Check if the conversion is successful
        if (isNaN(year)) {
            throw new Error('Invalid year provided');
        }

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
            // Include data for the selected year and the previous 4 years
            .andWhere('YEAR(ve.generation_date) BETWEEN :startYear AND :endYear', {
                startYear: year - 4,  // 4 years before the selected year
                endYear: year,        // Selected year
            })
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), ve.product_type')
            .orderBy('YEAR(ve.generation_date), ve.product_type')
            .getRawMany();

        return query;
    }

    async getTotalProductAndServiceSales(req: CommonReq) {
        const query = await this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS date`,
                `branch.id AS id`,
                `branch.name AS branchName`,
                `SUM(CASE WHEN ve.product_type = 'product' THEN ve.amount ELSE 0 END) AS productSales`,
                `SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END) AS serviceSales`,
                `SUM(CASE WHEN ve.product_type IN ('product', 'service') THEN ve.amount ELSE 0 END) AS totalSales`,
            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.generation_date >= CURDATE() - INTERVAL 30 DAY')
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            .groupBy('DATE(ve.generation_date), branch.id, branch.name')
            .orderBy('DATE(ve.generation_date)', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .getRawMany();

        return query;
    }

    async getTotalSalesForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS date`,
                `branch.name AS branchName`,
                `SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END) AS serviceSales`,
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            // .where('ve.generation_date >= :fromDate', { fromDate: req.fromDate })
            // .andWhere('ve.generation_date <= :toDate', { toDate: req.toDate })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.fromDate) {
            query.andWhere(`ve.generation_date >= :fromDate`, { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere(`ve.generation_date<= :toDate`, { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        // query.andWhere('branch.name = :branchName', { branchName: req.branchName });


        const data = await query
            .groupBy('DATE(ve.generation_date)')
            .addGroupBy('branch.id')
            .addGroupBy('branch.name')
            .orderBy('DATE(ve.generation_date)', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .getRawMany();
        return data
    }

    async getDayBookData(req: BranchChartDto) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE_FORMAT(ve.generation_date, '%Y-%m') AS date`,
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
            .andWhere('DATE_FORMAT(ve.generation_date, "%Y-%m") = :date', { date: req.date })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
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
            .addOrderBy('ve.product_type', 'ASC');

        const rawQuery = query.getQuery();
        console.log(rawQuery); // Log the raw SQL query
        const parameters = query.getParameters();
        console.log(parameters); // Log the parameters

        // Execute the query
        const result = await query.getRawMany();
        console.log(result); // Log the result
        return result;

    }

    async getDayBookDataForReport(req: {
        fromDate?: string; // YYYY-MM format
        toDate?: string; // YYYY-MM format
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `ve.generation_date AS generationDate`,
                `DATE_FORMAT(ve.generation_date, '%Y-%m') AS date`,
                `ve.voucher_id AS voucherId`,
                `ve.product_type AS productType`,
                `ve.voucher_type AS voucherType`,
                `ve.purpose AS purpose`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - 
             SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`,
                `branch.name AS branchName`
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE],
            })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere(`ve.generation_date >= :fromDate`, { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere(`ve.generation_date <= :toDate`, { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        query.groupBy(`
        YEAR(ve.generation_date), 
        MONTH(ve.generation_date), 
        ve.product_type, 
        DATE(ve.generation_date), 
        ve.voucher_id, 
        ve.voucher_type, 
        ve.purpose,
        branch.name
    `)
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .addOrderBy('ve.product_type', 'ASC');

        const data = await query.getRawMany();
        return data;

    }

    async getPurchaseCount(req: CommonReq): Promise<any> {
        const query = this.createQueryBuilder('ve')
            .select('COUNT(ve.voucher_id) AS totalPurchases')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('DATE(ve.generation_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
        const last30DaysResult = await query.getRawOne();
        const weekQuery = this.createQueryBuilder('ve')
            .select('COUNT(ve.voucher_id) AS totalPurchases')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('DATE(ve.generation_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
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

    async getExpansesTableData(req: InvoiceDto) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS expansesId',
                've.name AS name',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                'branch.name as branchName',
                've.payment_type as paymentMode'
            ])
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
        if (req.fromDate && req.toDate) {
            query.andWhere('ve.generation_date BETWEEN :fromDate AND :toDate', {
                fromDate: req.fromDate,
                toDate: req.toDate,
            });
        }
        if (req.paymentStatus) {
            query.andWhere('ve.payment_status = :paymentStatus', {
                paymentStatus: req.paymentStatus,
            });
        }

        const result = await query.getRawMany();
        return result;
    }

    async getExpenseData(req: CommonReq): Promise<any> {
        const query = this.createQueryBuilder('ve')
            .select('SUM(ve.amount) AS totalExpenses')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('ve.product_type = :productType', { productType: ProductType.expanses })
            .andWhere('DATE(ve.generationDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
        const last30DaysResult = await query.getRawOne();
        const weekQuery = this.createQueryBuilder('ve')
            .select('SUM(ve.amount) AS totalExpenses')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('ve.product_type = :productType', { productType: ProductType.expanses })
            .andWhere('DATE(ve.generationDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
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

    async getLast30DaysCreditAndDebitPercentages(req: CommonReq) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS date`,
                `branch.id as id`,
                `branch.name AS branchName`,
                `branch.branch_number AS branchNumber`,
                `branch.branch_address AS branchAddress`,
                `COALESCE(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) AS creditAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) AS debitAmount`,
                `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(ve.amount), 0) * 100, 2
                ) AS creditPercentage`,
                `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(ve.amount), 0) * 100, 2
                ) AS debitPercentage`
            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE]
            })
            .andWhere('ve.generation_date >= CURDATE() - INTERVAL 30 DAY')
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            .groupBy(`
                DATE(ve.generation_date), 
                branch.id, 
                branch.name, 
                branch.branch_number, 
                branch.branch_address
            `)
            .orderBy(`DATE(ve.generation_date)`, 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .addOrderBy('branch.branch_number', 'ASC')
            .getRawMany();

        return query;
    }

    async getSolidLiquidCash(req: CommonReq) {
        const result = await this.dataSource
            .getRepository(VoucherEntity)
            .createQueryBuilder('ve')
            .select([
                `SUM(CASE 
                    WHEN ve.voucher_type = :receipt 
                    AND ve.payment_type = :cash 
                    AND ve.product_type IN ('service', 'product', 'sales') 
                    THEN ve.amount ELSE 0 END) AS solidCash`,
                `SUM(CASE 
                    WHEN ve.voucher_type = :contra 
                    AND ve.payment_type = :cash 
                    THEN ve.amount ELSE 0 END) AS solidCashFromContra`,
                `SUM(CASE 
                    WHEN ve.voucher_type = :contra 
                    AND ve.from_account_id IS NOT NULL 
                    THEN ve.amount ELSE 0 END) AS liquidCash`,
                'br.name AS branchName',
                'ac.account_name AS paymentTo',
                'ac.account_number AS accountNumber',
            ])
            .leftJoin('branches', 'br', 'br.id = ve.branch_id')
            .leftJoin('accounts', 'ac', 'ac.id = ve.to_account_id')
            .where('ve.voucher_type IN (:...voucherTypes)', {
                voucherTypes: ['receipt', 'contra'],
            })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name, ac.account_name, ac.account_number') // Grouping by non-aggregated columns
            .setParameters({
                receipt: 'receipt',
                contra: 'contra',
                cash: 'cash',
            })
            .getRawMany();

        // Aggregate the result
        const aggregatedResult = result.reduce(
            (acc, row) => {
                acc.solidCash += parseFloat(row.solidCash || 0);
                acc.solidCashFromContra += parseFloat(row.solidCashFromContra || 0);
                acc.liquidCash += parseFloat(row.liquidCash || 0);

                acc.details.push({
                    branchName: row.branchName,
                    paymentTo: row.paymentTo,
                    accountNumber: row.accountNumber,
                });

                return acc;
            },
            { solidCash: 0, solidCashFromContra: 0, liquidCash: 0, details: [] },
        );

        return {
            solidCash: aggregatedResult.solidCash + aggregatedResult.solidCashFromContra,
            liquidCash: aggregatedResult.liquidCash,
            details: aggregatedResult.details,
        };
    }

    async getProductsPhotos(req: {
        subDealerId?: string;
        vendorId?: string;
        companyCode: string;
        unitCode: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                'pr.product_name as productName',
                'pr.product_photo as productPhoto'
            ])
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = ve.sub_dealer_id')
            .leftJoin(VendorEntity, 'vn', 'vn.id = ve.vendor_id')
            .leftJoin(ProductEntity, 'pr', 'pr.id = ve.product_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.vendorId) {
            query.andWhere('ve.vendor_id = :vendorId', { vendorId: req.vendorId });
        } else if (req.subDealerId) {
            query.andWhere('ve.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        } else {
            throw new Error('Either vendorId or subDealerId must be provided.');
        }

        const results = await query.getRawMany();

        return results.map((result) => ({
            productName: result.productName,
            productPhoto: result.productPhoto
        }));
    }

    async getBranchWiseSolidLiquidCash(req: CommonReq) {
        const result = await this.dataSource
            .getRepository(VoucherEntity)
            .createQueryBuilder('ve')
            .select([
                'br.name AS branchName',
                `SUM(CASE 
                    WHEN ve.voucher_type = :receipt 
                    AND ve.payment_type = :cash 
                    AND ve.product_type IN ('service', 'product', 'sales') 
                    THEN ve.amount ELSE 0 END) AS solidCash`,
                `SUM(CASE 
                    WHEN ve.voucher_type = :contra 
                    AND ve.from_account_id IS NOT NULL 
                    THEN ve.amount ELSE 0 END) AS liquidCash`,
            ])
            .leftJoin('branches', 'br', 'br.id = ve.branch_id')
            .where('ve.voucher_type IN (:...voucherTypes)', {
                voucherTypes: ['receipt', 'contra'],
            })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name') // Group by branch name
            .setParameters({
                receipt: 'receipt',
                contra: 'contra',
                cash: 'cash',
            })
            .getRawMany();

        // Format the response
        return result.map(row => ({
            branchName: row.branchName || 'Unknown Branch',
            solidCash: parseFloat(row.solidCash || 0),
            liquidCash: parseFloat(row.liquidCash || 0),
        }));
    }

    async getProductTypeCreditAndDebitPercentages(req: CommonReq) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS date`,
                `branch.id AS branchId`,
                `branch.name AS branchName`,
                `branch.branch_number AS branchNumber`,
                `branch.branch_address AS branchAddress`,

                // **Total Credit & Debit Amounts**
                `COALESCE(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) AS totalCreditAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) AS totalDebitAmount`,

                // **Product Type Wise Total Amounts for Credit**
                `COALESCE(SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END), 0) AS serviceTotalCreditAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type = 'product' THEN ve.amount ELSE 0 END), 0) AS productTotalCreditAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type = 'sales' THEN ve.amount ELSE 0 END), 0) AS salesTotalCreditAmount`,

                // **Product Type Wise Total Amounts for Debit**
                `COALESCE(SUM(CASE WHEN ve.product_type = 'expanses' THEN ve.amount ELSE 0 END), 0) AS expansesTotalDebitAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type = 'salaries' THEN ve.amount ELSE 0 END), 0) AS salariesTotalDebitAmount`,

                // **Credit Percentages Relative to Total Credit**
                `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS serviceCreditPercentage`,

                `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'product' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS productCreditPercentage`,

                `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'sales' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS salesCreditPercentage`,

                // **Debit Percentages Relative to Total Debit**
                `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'expanses' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS expansesDebitPercentage`,

                `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'salaries' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS salariesDebitPercentage`
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE]
            })
            .andWhere('ve.generation_date >= CURDATE() - INTERVAL 30 DAY')
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy(`
                DATE(ve.generation_date), 
                branch.id, 
                branch.name, 
                branch.branch_number, 
                branch.branch_address
            `)
            .orderBy(`DATE(ve.generation_date)`, 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .addOrderBy('branch.branch_number', 'ASC')
            .getRawMany();

        return query;
    }

}


