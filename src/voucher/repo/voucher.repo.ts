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
import { StaffEntity } from "src/staff/entity/staff.entity";
import { AccountDto } from "src/account/dto/account.dto";
import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { LedgerEntity, RegistrationType } from "src/ledger/entity/ledger.entity";
import { UnderPrimary, UnderSecondary } from "src/groups/entity/groups.entity";
import { RcsReportDto } from "../dto/rcs-report.dto";
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
                'es.invoicePdfUrl'
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
            .addGroupBy('es.estimate_date')
            .addGroupBy('es.expire_date')
            .addGroupBy('es.id')  // Add es.id to GROUP BY
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
                'es.receiptPdfUrl'
            ])
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoinAndSelect(EstimateEntity, 'es', 've.invoice_id = es.id')
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
        unitCode?: string; staffId?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS paymentId',
                'cl.name AS clientName',
                've.generation_date AS generationDate',
                'ac.account_name AS paymentTo',
                'ac.account_number AS accountNumber',
                've.payment_status AS paymentStatus',
                'sf.name as staffName',
                've.amount AS amount',
            ])
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoin(AccountEntity, 'ac', 'ac.id=ve.to_account_id')
            .leftJoin(StaffEntity, 'sf', 'sf.id=ve.staff_id')
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

        if (filters.staffId) {
            query.andWhere('sf.staff_id = :staffId', { staffId: filters.staffId });
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

    async getClientPurchaseOrderDataTable(req: {
        phoneNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                'cl.name AS clientName',
                'cl.phone_number AS phoneNumber',
                'cl.client_id AS clientId',
                'cl.address AS address',
                've.voucher_id AS voucherId',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                've.name AS name',
                've.quantity AS quantity',
                've.payment_status AS paymentStatus',
                'pa.product_name AS productName',
                'SUM(ve.amount) AS totalAmount'
            ])
            .leftJoin(ProductEntity, 'pa', 've.product_id = pa.id')
            .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
            // Optional filters based on provided phoneNumber, companyCode, and unitCode
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
        query.andWhere('cl.phone_number = :phoneNumber', { phoneNumber: req.phoneNumber });


        // If phoneNumber is provided, filter by phoneNumber
        // if (req.phoneNumber) {
        //     query.andWhere('cl.phone_number = :phoneNumber', { phoneNumber: req.phoneNumber });
        // }

        // Group by necessary fields
        query.groupBy('cl.client_id')
            .addGroupBy('cl.name')
            .addGroupBy('cl.phone_number')
            .addGroupBy('cl.address')
            .addGroupBy('cl.address')

            .addGroupBy('ve.voucher_id');
        // query.groupBy('ve.voucher_id')
        //     .addGroupBy('cl.name')
        //     .addGroupBy('cl.phone_number')
        //     .addGroupBy('cl.client_id')
        //     .addGroupBy('cl.address')
        //     .addGroupBy('ve.generation_date')
        //     .addGroupBy('ve.purpose')
        //     .addGroupBy('ve.name')
        //     .addGroupBy('ve.quantity')
        //     .addGroupBy('ve.payment_status')
        //     .addGroupBy('pa.product_name');

        // Execute the query and return results
        const result = await query.getRawMany();
        return result;
    }

    // async getLedgerDataById(req: {
    //     subDealerId?: number; clientId?: number; vendorId?: number; companyCode?: string; unitCode?: string
    // }) {
    //     const query = this.createQueryBuilder('ve')
    //         .select([
    //             've.voucher_id AS ledgerId',
    //             'cl.name AS clientName',
    //             'sb.name AS subDealerName',
    //             'vr.name AS vendorName',
    //             've.generation_date AS generationDate',
    //             've.purpose AS purpose',
    //             'cl.phone_number AS phoneNumber',
    //             'sb.sub_dealer_id AS subDealerId',
    //             'cl.client_id  as clientId',
    //             'vr.vendor_id AS vendorId',
    //             'cl.email AS clientEmail',
    //             'cl.address AS clientAddress',
    //             'cl.client_photo AS clientPhoto',
    //             'cl.GST_number AS clientGSTNumber',
    //             'sb.sub_dealer_phone_number AS subDealerPhoneNumber',
    //             'sb.gst_number AS subDealerGSTNumber',
    //             'sb.address AS subDealerAddress',
    //             'sb.sub_dealer_photo AS subDealerPhoto',
    //             'sb.email AS subDealerEmail',
    //             'vr.vendor_phone_number AS vendorPhoneNumber',
    //             'vr.GST_number AS vendorGSTNumber',
    //             'vr.address AS vendorAddress',
    //             'vr.vendor_photo AS vendorPhoto',
    //             'vr.email AS vendorEmail',
    //             've.payment_status AS paymentStatus',
    //             've.amount AS amount',
    //             'branch.name AS branchName',
    //             `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
    //             `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
    //             `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - 
    //              SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`
    //         ])
    //         .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
    //         .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
    //         .leftJoin(SubDealerEntity, 'sb', 've.sub_dealer_id = sb.id')
    //         .leftJoin(VendorEntity, 'vr', 've.vendor_id = vr.id')
    //         .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
    //         .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

    //     // Ensure data is fetched even if only one of the IDs exists in a row
    //     query.andWhere(
    //         new Brackets(qb => {
    //             if (req.clientId) qb.orWhere('ve.client_id = :clientId', { clientId: req.clientId });
    //             if (req.vendorId) qb.orWhere('ve.vendor_id = :vendorId', { vendorId: req.vendorId });
    //             if (req.subDealerId) qb.orWhere('ve.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
    //         })
    //     );

    //     query.groupBy('ve.voucher_id');

    //     const result = await query.getRawMany();
    //     return result;
    // }

    // async getLedgerDataForReport(req: {
    //     fromDate?: string;
    //     toDate?: string;
    //     clientName?: string;
    //     companyCode?: string;
    //     unitCode?: string;
    // }) {
    //     const query = this.createQueryBuilder('ve')
    //         .select([
    //             've.voucher_id AS voucherId',
    //             've.name AS name',
    //             'cl.name AS clientName',
    //             've.generation_date AS generationDate',
    //             've.expire_date AS expireDate',
    //             've.payment_status AS paymentStatus',
    //             'cl.phone_number AS phoneNumber',
    //             'cl.email AS email',
    //             'cl.address AS address',
    //             'cl.client_photo as clientPhoto',
    //             'cl.GST_number as GSTNumber',
    //             've.voucher_type AS voucherType',
    //             `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
    //             `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
    //             `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - 
    //             SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`,
    //             've.purpose AS purpose',
    //             'branch.name AS branchName',
    //         ])
    //         .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
    //         .leftJoin(ClientEntity, 'cl', 've.client_id = cl.id')
    //         .where('ve.voucher_type IN (:...types)', {
    //             types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE],
    //         })
    //         .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
    //         .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode });
    //     if (req.fromDate) {
    //         query.andWhere(`ve.generation_date >= :fromDate`, { fromDate: req.fromDate });
    //     }
    //     if (req.toDate) {
    //         query.andWhere(`ve.generation_date<= :toDate`, { toDate: req.toDate });
    //     }
    //     if (req.clientName) {
    //         query.andWhere('cl.name = :clientName', { clientName: req.clientName });
    //     }
    //     query.groupBy('ve.voucher_id')
    //         .addGroupBy('ve.name')
    //         .addGroupBy('cl.name')
    //         .addGroupBy('branch.name')
    //         .addGroupBy('ve.generation_date')
    //         .addGroupBy('ve.expire_date')
    //         .addGroupBy('ve.payment_status')
    //         .addGroupBy('cl.phone_number')
    //         .addGroupBy('cl.email')
    //         .addGroupBy('cl.address')
    //         .addGroupBy('ve.purpose')
    //         .orderBy('YEAR(ve.generation_date)', 'ASC')
    //         .addOrderBy('MONTH(ve.generation_date)', 'ASC');
    //     const data = await query.getRawMany();

    //     return data;
    // }
    // async getDetailLedgerData(req: VoucherIDResDTo) {
    //     const query = await this.createQueryBuilder('ve')
    //         .select([
    //             've.voucher_id AS voucherId',
    //             've.name AS name',
    //             'cl.name AS clientName',
    //             've.generation_date AS generationDate',
    //             've.expire_date AS expireDate',
    //             've.payment_status AS paymentStatus',
    //             'cl.phone_number AS phoneNumber',
    //             'cl.email AS email',
    //             'cl.address AS address',
    //             `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
    //             `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
    //             `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`,
    //             've.purpose AS purpose',
    //             'branch.name AS branchName',
    //         ])
    //         .leftJoinAndSelect(ClientEntity, 'cl', 've.client_id = cl.id')
    //         .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = ve.branch_id')
    //         .where(`ve.voucher_id = "${req.voucherId}"`)
    //         .andWhere('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
    //         .andWhere(`ve.company_code = "${req.companyCode}"`)
    //         .andWhere(`ve.unit_code = "${req.unitCode}"`)
    //         .groupBy('ve.voucher_id')
    //         .addGroupBy('ve.name')
    //         .addGroupBy('cl.name')
    //         .addGroupBy('branch.name')
    //         .addGroupBy('ve.generation_date')
    //         .addGroupBy('ve.expire_date')
    //         .addGroupBy('ve.payment_status')
    //         .addGroupBy('cl.phone_number')
    //         .addGroupBy('cl.email')
    //         .addGroupBy('cl.address')
    //         .addGroupBy('ve.purpose')
    //         .getRawOne();

    //     return query;
    // }

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
                `branch.name AS branchName`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) - SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS balanceAmount`
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE] })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date), MONTHNAME(ve.generation_date), branch.name');

        const rawData = await query.getRawMany();

        // Organizing the data by branch
        const groupedData = rawData.reduce((acc, item) => {
            const branchName = item.branchName || "Unknown Branch"; // Default if branch name is null
            if (!acc[branchName]) {
                acc[branchName] = [];
            }
            acc[branchName].push({
                year: item.year,
                month: item.month,
                monthName: item.monthName,
                creditAmount: item.creditAmount,
                debitAmount: item.debitAmount,
                balanceAmount: item.balanceAmount,
            });
            return acc;
        }, {});

        // Transform grouped data into an array format
        const formattedResponse = Object.keys(groupedData).map(branchName => ({
            branchName,
            data: groupedData[branchName],
        }));

        return formattedResponse


    }

    async getYearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<any> {
        const year = Number(req.date);
        if (!year || isNaN(year)) {
            throw new Error('Invalid year provided');
        }

        const query = this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
                `MONTH(ve.generation_date) AS month`,
                `MONTHNAME(ve.generation_date) AS monthName`, // This column must be included in GROUP BY
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `ROUND(
                IF(SUM(ve.amount) > 0,
                    SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) / SUM(ve.amount) * 100, 
                    0
                ), 2
            ) AS creditPercentage`,
                `ROUND(
                IF(SUM(ve.amount) > 0,
                    SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) / SUM(ve.amount) * 100, 
                    0
                ), 2
            ) AS debitPercentage`
            ])
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE]
            })
            .andWhere('YEAR(ve.generation_date) = :year', { year })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date), MONTHNAME(ve.generation_date)') // Add MONTHNAME here
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .getRawMany();

        return query

    }
    async get4YearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<any> {
        const year = Number(req.date);
        if (!year || isNaN(year)) {
            throw new Error('Invalid year provided');
        }

        const query = this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
                `SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) AS creditAmount`,
                `SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) AS debitAmount`,
                `ROUND(
                    IF(SUM(ve.amount) > 0,
                        SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END) / SUM(ve.amount) * 100, 
                        0
                    ), 2
                ) AS creditPercentage`,
                `ROUND(
                    IF(SUM(ve.amount) > 0,
                        SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END) / SUM(ve.amount) * 100, 
                        0
                    ), 2
                ) AS debitPercentage`
            ])
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.PAYMENT, VoucherTypeEnum.PURCHASE]
            })
            .andWhere('YEAR(ve.generation_date) BETWEEN :startYear AND :endYear', {
                startYear: year - 3, // Last 4 years including selected year
                endYear: year
            })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date)') // Grouping only by year
            .orderBy('YEAR(ve.generation_date)', 'ASC')
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
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
        const last30DaysResult = await query.getRawOne();

        const weekQuery = this.createQueryBuilder('ve')
            .select('COUNT(ve.voucher_id) AS totalPurchases')
            .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
            .andWhere('DATE(ve.generation_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
        const last7DaysResult = await weekQuery.getRawOne();

        const last30DaysPurchases = Number(last30DaysResult.totalPurchases);
        const last7DaysPurchases = Number(last7DaysResult.totalPurchases);

        let percentageChange = 0;
        if (last7DaysPurchases && last30DaysPurchases) {
            // Calculate percentage change
            percentageChange = ((last30DaysPurchases - last7DaysPurchases) / last7DaysPurchases) * 100;
            // Optionally, cap the percentage at 100% if you want to limit positive growth
            percentageChange = Math.min(percentageChange, 100);
        }

        return {
            last30DaysPurchases: last30DaysPurchases,
            percentageChange: percentageChange.toFixed(2), // Will show negative percentages for losses
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
            .where('ve.voucher_type IN (:...types)', {
                types: [VoucherTypeEnum.JOURNAL, VoucherTypeEnum.PAYMENT]
            })
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

    // async getExpenseData(req: CommonReq): Promise<any> {
    //     const query = this.createQueryBuilder('ve')
    //         .select('SUM(ve.amount) AS totalExpenses')
    //         .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
    //         .andWhere('ve.product_type = :productType', { productType: ProductType.expanses })
    //         .andWhere('DATE(ve.generationDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
    //         .andWhere(`ve.company_code = "${req.companyCode}"`)
    //         .andWhere(`ve.unit_code = "${req.unitCode}"`)
    //     const last30DaysResult = await query.getRawOne();
    //     const weekQuery = this.createQueryBuilder('ve')
    //         .select('SUM(ve.amount) AS totalExpenses')
    //         .where('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE })
    //         .andWhere('ve.product_type = :productType', { productType: ProductType.expanses })
    //         .andWhere('DATE(ve.generationDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()')
    //         .andWhere(`ve.company_code = "${req.companyCode}"`)
    //         .andWhere(`ve.unit_code = "${req.unitCode}"`)
    //     const last7DaysResult = await weekQuery.getRawOne();
    //     const last30DaysExpenses = last30DaysResult.totalExpenses;
    //     const last7DaysExpenses = last7DaysResult.totalExpenses;
    //     let percentageChange = 0;
    //     if (last7DaysExpenses && last30DaysExpenses) {
    //         percentageChange = ((last30DaysExpenses - last7DaysExpenses) / last7DaysExpenses) * 100;
    //     }

    //     return {
    //         last30DaysExpenses: last30DaysExpenses,
    //         percentageChange: percentageChange.toFixed(2),
    //     };
    // }

    async getLast30DaysCreditAndDebitPercentages(req: { companyCode: string, unitCode: string, branchName?: string }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `branch.name AS branchName`,
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
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        query
            .groupBy('branch.name') // Use groupBy instead of addGroupBy
            .orderBy('branch.name', 'ASC');

        return query.getRawMany();
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

    async getProductTypeCreditAndDebitPercentages(req: BranchChartDto): Promise<any> {
        const year = Number(req.date); // Convert to number

        // Check if the conversion is successful
        if (isNaN(year)) {
            throw new Error('Invalid year provided');
        }
        const query = this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
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
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy(`
                year(ve.generation_date), 
                branch.id, 
                branch.name, 
                branch.branch_number, 
                branch.branch_address
            `)
            .orderBy(`year(ve.generation_date)`, 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .addOrderBy('branch.branch_number', 'ASC')
            .getRawMany();

        return query;
    }

    async get4ProductTypeCreditAndDebitPercentages(req: BranchChartDto): Promise<any> {
        const year = Number(req.date);
        if (isNaN(year)) {
            throw new Error('Invalid year provided');
        }

        const query = this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
                `branch.id AS branchId`,
                `branch.name AS branchName`,
                `branch.branch_number AS branchNumber`,
                `branch.branch_address AS branchAddress`,

                // **Total Credit & Debit Amounts**
                `COALESCE(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) AS totalCreditAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) AS totalDebitAmount`,

                // **Product Type Wise Totals for Credit**
                `COALESCE(SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END), 0) AS serviceTotalCreditAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type = 'product' THEN ve.amount ELSE 0 END), 0) AS productTotalCreditAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type = 'sales' THEN ve.amount ELSE 0 END), 0) AS salesTotalCreditAmount`,

                // **Product Type Wise Totals for Debit**
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
            .andWhere('YEAR(ve.generation_date) BETWEEN :startYear AND :endYear', {
                startYear: year - 3,
                endYear: year
            })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy(`
                YEAR(ve.generation_date), 
                branch.id, 
                branch.name, 
                branch.branch_number, 
                branch.branch_address
            `)
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .addOrderBy('branch.branch_number', 'ASC')
            .getRawMany();

        return query;
    }

    async getPurchaseOrderDataTable(req: {
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS voucherId',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                've.name AS name',
                've.quantity AS quantity',
                've.payment_status AS paymentStatus',
                'pa.product_name AS productName',
                'SUM(ve.amount) AS totalAmount' // Aggregating total amount
            ])
            .leftJoin(SubDealerEntity, 'sb', 've.sub_dealer_id = sb.id')
            .leftJoin(ProductEntity, 'pa', 've.product_id = pa.id')
            .leftJoin(StaffEntity, 'sf', 'sf.id=ve.staff_id')
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.PURCHASE] })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
        if (req.staffId) {
            query.andWhere('sf.staff_id = :staffId', { staffId: req.staffId });
        }
        query.groupBy('ve.voucher_id')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_status')
            .addGroupBy('ve.name')
            .addGroupBy('pa.product_name')
            .addGroupBy('ve.quantity');

        return await query.getRawMany();
    }

    async getPaymentDataTable(req: {
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS voucherId',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                've.name AS name',
                'sf.name as staffName',
                've.quantity AS quantity',
                've.payment_status AS paymentStatus',
                'pa.product_name AS productName',
                'SUM(ve.amount) AS totalAmount' // Aggregating total amount
            ])
            .leftJoin(SubDealerEntity, 'sb', 've.sub_dealer_id = sb.id')
            .leftJoin(ProductEntity, 'pa', 've.product_id = pa.id')
            .leftJoin(StaffEntity, 'sf', 'sf.id = ve.staff_id')
            .where('ve.voucher_type IN (:...types)', { types: [VoucherTypeEnum.PAYMENT] })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        // Add staffId condition if provided
        if (req.staffId) {
            query.andWhere('sf.staff_id = :staffId', { staffId: req.staffId });
        }

        // Group by necessary fields
        query.groupBy('ve.voucher_id')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_status')
            .addGroupBy('ve.name')
            .addGroupBy('pa.product_name')
            .addGroupBy('ve.quantity');

        return await query.getRawMany();
    }
    //---------------New Version APIS------------------------------

    async getBranchWiseYearlySales(req: BranchChartDto): Promise<any> {
        const year = Number(req.date);
        if (!year || isNaN(year)) {
            throw new Error('Invalid year provided');
        }

        const query = await this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
                `br.name AS branchName`,
                `SUM(ve.amount) AS TotalSalesAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END), 0) AS serviceTotalAmount`,
                `COALESCE(SUM(CASE WHEN ve.product_type = 'product' THEN ve.amount ELSE 0 END), 0) AS productTotalAmount`,
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.voucher_type = :salesType', { salesType: VoucherTypeEnum.SALES })  // Already filtering by Sales
            .andWhere('YEAR(ve.generation_date) = :year', { year })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name, YEAR(ve.generation_date)')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .getRawMany();

        return query;
    }

    async getBranchWiseMonthlySales(req: BranchChartDto): Promise<any> {
        const year = Number(req.date);
        if (!year || isNaN(year)) {
            throw new Error('Invalid year provided');
        }

        const query = await this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
                `MONTH(ve.generation_date) AS month`,
                `br.name AS branchName`,
                `SUM(CASE WHEN ve.voucher_type = :salesType THEN ve.amount ELSE 0 END) AS TotalSalesAmount`
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.voucher_type = :salesType', { salesType: VoucherTypeEnum.SALES })
            .andWhere('YEAR(ve.generation_date) = :year', { year })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name, YEAR(ve.generation_date), MONTH(ve.generation_date)')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .getRawMany();

        return query;
    }

    async getOverAllYearlySales(req: BranchChartDto): Promise<any> {
        const year = Number(req.date);
        if (!year || isNaN(year)) {
            throw new Error('Invalid year provided');
        }

        const query = await this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`,
                `MONTH(ve.generation_date) AS month`,
                `SUM(CASE WHEN ve.voucher_type = :salesType THEN ve.amount ELSE 0 END) AS TotalSalesAmount`
            ])
            .where('ve.voucher_type = :salesType', { salesType: VoucherTypeEnum.SALES })
            .andWhere('YEAR(ve.generation_date) = :year', { year })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date)')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .getRawMany();

        return query;
    }

    //current year against current month payble and recible amounts
    async getTotalPayableAndReceivablePercentage(req: BranchChartDto) {
        const query = this.createQueryBuilder('ve')
            .select([
                `branch.id AS id`,
                `branch.name AS branchName`,
                `SUM(CASE WHEN ve.voucher_type = 'Sales' THEN ve.amount ELSE 0 END) AS totalSales`,
                `SUM(CASE WHEN ve.voucher_type = 'Purchase' THEN ve.amount ELSE 0 END) AS totalPurchases`,
                `SUM(CASE WHEN ve.voucher_type = 'Sales' AND ve.payment_status = :pendingStatus THEN ve.amount ELSE 0 END) AS receivables`,
                `SUM(CASE WHEN ve.voucher_type = 'Purchase' AND ve.payment_status = :pendingStatus THEN ve.amount ELSE 0 END) AS payables`,
                `ROUND(
                    COALESCE(
                        (SUM(CASE WHEN ve.voucher_type = 'Sales' AND ve.payment_status = :pendingStatus THEN ve.amount ELSE 0 END) /
                        NULLIF(SUM(CASE WHEN ve.voucher_type = 'Sales' THEN ve.amount ELSE 0 END), 0)) * 100, 0
                    ), 2
                ) AS receivablePercentage`,
                `ROUND(
                    COALESCE(
                        (SUM(CASE WHEN ve.voucher_type = 'Purchase' AND ve.payment_status = :pendingStatus THEN ve.amount ELSE 0 END) /
                        NULLIF(SUM(CASE WHEN ve.voucher_type = 'Purchase' THEN ve.amount ELSE 0 END), 0)) * 100, 0
                    ), 2
                ) AS payablePercentage`
            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode });

        // Apply optional filters
        if (req.date) {
            query.andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date });
        }
        if (req.branchName) {
            query.andWhere(`LOWER(branch.name) = LOWER(:branchName)`, { branchName: req.branchName });
        }

        query.groupBy('branch.id, branch.name')
            .orderBy('branch.name', 'ASC')
            .setParameter('pendingStatus', PaymentStatus.PENDING);

        return query.getRawMany();
    }

    async getSalesBreakdown(req: BranchChartDto) {
        const query = await this.createQueryBuilder('ve')
            .select([
                `YEAR(ve.generation_date) AS year`, // Selecting Year
                `branch.id AS branchId`,
                `branch.name AS branchName`,
                `SUM(JSON_EXTRACT(ve.product_details, '$[*].totalCost')) AS totalSalesAmount`, // Changed to sum extractedAmount
                `SUM(JSON_EXTRACT(ve.product_details, '$[*].totalCost')) AS extractedAmount`,
                `SUM(
                    JSON_EXTRACT(ve.product_details, '$[*].totalCost') 
                    * (JSON_UNQUOTE(JSON_EXTRACT(ve.product_details, '$[*].type')) = 'Rectifications')
                ) AS rectificationsAmount`,
                `SUM(
                    JSON_EXTRACT(ve.product_details, '$[*].totalCost') 
                    * (JSON_UNQUOTE(JSON_EXTRACT(ve.product_details, '$[*].type')) = 'Renewables')
                ) AS renewablesAmount`,
                `SUM(
                    JSON_EXTRACT(ve.product_details, '$[*].totalCost') 
                    * (JSON_UNQUOTE(JSON_EXTRACT(ve.product_details, '$[*].type')) = 'Replacements')
                ) AS replacementsAmount`,
                `SUM(
                    JSON_EXTRACT(ve.product_details, '$[*].totalCost') 
                    * (JSON_UNQUOTE(JSON_EXTRACT(ve.product_details, '$[*].type')) = 'ProductSales')
                ) AS productSalesAmount`,
                `SUM(
                    JSON_EXTRACT(ve.product_details, '$[*].totalCost') 
                    * (JSON_UNQUOTE(JSON_EXTRACT(ve.product_details, '$[*].type')) = 'ServiceSales')
                ) AS serviceSalesAmount`,
                `SUM(
                    JSON_EXTRACT(ve.product_details, '$[*].totalCost') 
                    * (JSON_UNQUOTE(JSON_EXTRACT(ve.product_details, '$[*].type')) = 'others')
                ) AS otherSalesAmount`
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where(`YEAR(ve.generation_date) = :year`, { year: req.date }) // Filtering by selected year
            .andWhere(`ve.voucher_type = 'Sales'`)
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            // .andWhere(`ve.payment_status = :pendingStatus`, { pendingStatus: PaymentStatus.PENDING })
            .groupBy('YEAR(ve.generation_date), branch.id, branch.name') // Grouping by Year & Branch
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .getRawMany();

        return query;
    }

    async getSalesForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS "date"`,
                `branch.name AS "branchName"`,
                `ve.voucher_id AS "voucherId"`,
                `ve.purpose AS "purpose"`,
                `ve.payment_type AS "paymentType"`,
                `ve.amount AS "amount"`,
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.voucher_type = :voucherType', { voucherType: VoucherTypeEnum.SALES });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        const data = await query
            .groupBy('ve.voucher_id') // Grouping by unique vouchers
            .addGroupBy('ve.generation_date')
            .addGroupBy('branch.name')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_type')
            .addGroupBy('ve.amount')
            .orderBy('ve.generation_date', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .getRawMany();

        return data;
    }

    async getPayableAmountForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS "date"`,
                `ve.voucher_id AS "voucherId"`,
                `ve.purpose AS "purpose"`,
                `branch.name AS "branchName"`,
                `ve.amount AS "amount"`,
                `MAX(ve.due_date) AS "lastDueDate"`,
                `CASE  
                    WHEN ve.due_date < CURRENT_DATE THEN DATEDIFF(CURRENT_DATE, ve.due_date)  
                    ELSE NULL  
                END AS "overdueDays"`,
                `ledger.name AS "ledgerName"`,
            ])
            .leftJoin(LedgerEntity, 'ledger', 'ledger.id = ve.ledger_id')
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.payment_status = :pendingStatus', { pendingStatus: PaymentStatus.PENDING })
            .andWhere('ve.voucher_type = :voucherType', { voucherType: VoucherTypeEnum.PURCHASE });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        const data = await query
            .groupBy('ve.voucher_id') // Ensure each voucher is uniquely grouped
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('branch.name')
            .addGroupBy('ve.amount')
            .orderBy('ve.generation_date', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .getRawMany();

        return data;
    }

    async getReceivableAmountForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = await this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS date`,
                `ve.voucher_id AS "voucherId"`,
                `ve.purpose AS "purpose"`,
                `branch.name AS branchName`,
                've.amount AS "amount"',
                'ledger.name AS ledgerName'
            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .leftJoin(LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere(`ve.payment_status = :pendingStatus`, { pendingStatus: PaymentStatus.PENDING })
            .andWhere(`ve.voucher_type = :voucherType`, { voucherType: VoucherTypeEnum.SALES })

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName })
        }

        const data = await query
            .groupBy('ve.voucher_id')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_type')
            .addGroupBy('branch.name')
            .addGroupBy('ve.amount')

            .getRawMany();

        return data;
    }

    async getAllPaymentsVouchers(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS ledgerId',
                've.generation_date AS generationDate',
                've.purpose AS purpose',
                've.payment_status AS paymentStatus',
                've.amount AS amount',
                'branch.name AS branchName',
                'ledger.name AS ledgerName',
                've.voucher_type AS voucherType',
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoin(LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        query.groupBy('ve.voucher_id')
            .addGroupBy('branch.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_status')
            .addGroupBy('ve.amount')
            .addGroupBy('ve.voucher_type')
            .addGroupBy('ledger.name'); // Added to match SELECT fields

        return await query.getRawMany();
    }


    async getPurchaseDataForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_id AS "purchaseId"',
                'br.name AS "branchName"',
                've.generation_date AS "generationDate"',
                've.purpose AS "purpose"',
                've.amount AS "amount"',
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.voucher_type = :type', { type: VoucherTypeEnum.PURCHASE });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        const data = await query
            .groupBy('ve.voucher_id')  // Group by voucher_id to get individual voucher amounts
            .addGroupBy('br.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.amount')
            .orderBy('ve.generation_date', 'ASC')
            .getRawMany();

        return data;
    }

    async getAmountDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `SUM(CASE WHEN ve.payment_status = 'PENDING' AND ve.voucher_type = 'SALES' THEN ve.amount ELSE 0 END) AS ReceivableAmount`,
                `SUM(CASE WHEN ve.payment_status = 'PENDING' AND ve.voucher_type = 'PURCHASE' THEN ve.amount ELSE 0 END) AS PayableAmount`,
                `SUM(CASE WHEN ve.voucher_type = 'SALES' THEN ve.amount ELSE 0 END) AS SalesAmount`,
            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        // Apply branch name filter only if provided
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        return query.getRawOne(); // Returns a single object instead of an array
    }

    async getVoucherAmountDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `SUM(CASE WHEN ve.payment_status = 'PENDING' THEN ve.amount ELSE 0 END) AS pendingAmount`,
                `SUM(CASE WHEN ve.payment_status = 'COMPLETED' THEN ve.amount ELSE 0 END) AS receivedAmount`
            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        // Apply branch name filter only if provided
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        return query.getRawOne(); // Returns a single object instead of an array
    }

    async getSolidLiquidCash(req: CommonReq) {
        // 1️⃣ Get total balance in all accounts from `AccountEntity` (No need for payment type filtering)
        const bankBalanceResult = await this.dataSource
            .getRepository(AccountEntity)
            .createQueryBuilder('ac')
            .select('SUM(ac.total_amount)', 'bankBalance')
            .where('ac.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ac.unit_code = :unitCode', { unitCode: req.unitCode })
            .getRawOne();

        // 2️⃣ Get transactions from vouchers that affect banks (receipt & payment)
        const bankTransactions = await this.dataSource
            .getRepository(VoucherEntity)
            .createQueryBuilder('ve')
            .select([
                `SUM(CASE 
                    WHEN ve.payment_type IN (:...bankPayments) AND ve.voucher_type IN (:...positiveVouchers) THEN ve.amount 
                    WHEN ve.payment_type IN (:...bankPayments) AND ve.voucher_type IN (:...negativeVouchers) THEN -ve.amount 
                    ELSE 0 
                END) AS bankTransactions`,
            ])
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .setParameters({
                bankPayments: [PaymentType.BANK, PaymentType.UPI, PaymentType.CARD, PaymentType.cheque],
                positiveVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE], // Increase bank balance
                negativeVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE], // Decrease bank balance
            })
            .getRawOne();

        // 3️⃣ Get solid cash (only transactions with `payment_type = cash`)
        const solidCashResult = await this.dataSource
            .getRepository(VoucherEntity)
            .createQueryBuilder('ve')
            .select([
                `SUM(CASE 
                    WHEN ve.payment_type = :cash AND ve.voucher_type IN (:...positiveVouchers) THEN ve.amount 
                    WHEN ve.payment_type = :cash AND ve.voucher_type IN (:...negativeVouchers) THEN -ve.amount 
                    ELSE 0 
                END) AS solidCash`,
            ])
            .setParameters({
                cash: PaymentType.CASH,
                positiveVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE],
                negativeVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE],
            })
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .getRawOne();

        return {
            solidCash: parseFloat(solidCashResult?.solidCash || 0),
            liquidCash: parseFloat(bankBalanceResult?.bankBalance || 0) + parseFloat(bankTransactions?.bankTransactions || 0),
        };
    }

    async getBranchWiseSolidLiquidCash(req: CommonReq) {
        // 1️⃣ Get branch-wise liquid cash (total balance from AccountEntity)
        const liquidCashResults = await this.dataSource
            .getRepository(AccountEntity)
            .createQueryBuilder('ac')
            .select([
                'br.name AS branchName',
                'SUM(ac.total_amount) AS liquidCash',
            ])
            .leftJoin('branches', 'br', 'br.id = ac.branch_id') // Assuming `branch_id` exists in AccountEntity
            .where('ac.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ac.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name')
            .getRawMany();

        // 2️⃣ Get bank transactions from VoucherEntity (both positive & negative)
        const bankTransactions = await this.dataSource
            .getRepository(VoucherEntity)
            .createQueryBuilder('ve')
            .select([
                'br.name AS branchName',
                `SUM(CASE 
                    WHEN ve.payment_type IN (:...bankPayments) AND ve.voucher_type IN (:...positiveVouchers) THEN ve.amount 
                    WHEN ve.payment_type IN (:...bankPayments) AND ve.voucher_type IN (:...negativeVouchers) THEN -ve.amount 
                    ELSE 0 
                END) AS bankTransactions`,
            ])
            .leftJoin('branches', 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name')
            .setParameters({
                bankPayments: [PaymentType.BANK, PaymentType.UPI, PaymentType.CARD, PaymentType.cheque],
                positiveVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE],
                negativeVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE],
            })
            .getRawMany();

        // 3️⃣ Get branch-wise solid cash (cash transactions from VoucherEntity)
        const solidCashResults = await this.dataSource
            .getRepository(VoucherEntity)
            .createQueryBuilder('ve')
            .select([
                'br.name AS branchName',
                `SUM(CASE 
                    WHEN ve.payment_type = :cash AND ve.voucher_type IN (:...positiveVouchers) THEN ve.amount 
                    WHEN ve.payment_type = :cash AND ve.voucher_type IN (:...negativeVouchers) THEN -ve.amount 
                    ELSE 0 
                END) AS solidCash`,
            ])
            .leftJoin('branches', 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name')
            .setParameters({
                cash: PaymentType.CASH,
                positiveVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE],
                negativeVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE],
            })
            .getRawMany();

        // 4️⃣ Merge results into a single structure
        const branchWiseData = new Map<string, { branchName: string; solidCash: number; liquidCash: number }>();

        // Populate liquid cash data
        liquidCashResults.forEach(row => {
            branchWiseData.set(row.branchName, {
                branchName: row.branchName || 'Unknown Branch',
                liquidCash: parseFloat(row.liquidCash || '0'),
                solidCash: 0,
            });
        });

        // Add bank transactions to liquid cash
        bankTransactions.forEach(row => {
            if (!branchWiseData.has(row.branchName)) {
                branchWiseData.set(row.branchName, {
                    branchName: row.branchName || 'Unknown Branch',
                    liquidCash: 0,
                    solidCash: 0,
                });
            }
            branchWiseData.get(row.branchName)!.liquidCash += parseFloat(row.bankTransactions || '0');
        });

        // Populate solid cash data
        solidCashResults.forEach(row => {
            if (!branchWiseData.has(row.branchName)) {
                branchWiseData.set(row.branchName, {
                    branchName: row.branchName || 'Unknown Branch',
                    solidCash: 0,
                    liquidCash: 0,
                });
            }
            branchWiseData.get(row.branchName)!.solidCash += parseFloat(row.solidCash || '0');
        });

        return Array.from(branchWiseData.values());
    }

    async getBranchWiseAccountAmounts(req: CommonReq) {
        // Fetch account-wise amounts grouped by branch
        const accountWiseAmounts = await this.dataSource
            .getRepository(AccountEntity)
            .createQueryBuilder('ac')
            .select([
                'br.name AS branchName',
                'ac.account_name AS accountName',
                'SUM(ac.total_amount) AS accountAmount',
            ])
            .leftJoin('branches', 'br', 'br.id = ac.branch_id')
            .where('ac.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ac.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name, ac.account_name')
            .getRawMany();

        // Transform data into the required format
        const branchAccountData: Record<string, Record<string, number>> = {};

        accountWiseAmounts.forEach(row => {
            const branchName = row.branchName || 'Unknown Branch';
            const accountName = row.accountName || 'Unknown Account';
            const accountAmount = parseFloat(row.accountAmount || '0');

            if (!branchAccountData[branchName]) {
                branchAccountData[branchName] = {};
            }

            branchAccountData[branchName][accountName] = accountAmount;
        });

        // Convert object into array format
        return Object.entries(branchAccountData).map(([branch, accounts]) => ({
            [branch]: accounts,
        }));
    }

    async calculateGstReturns(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.voucher_type AS voucherType',
                'SUM(ve.amount) AS totalAmount',
                'SUM(ve.cgst) AS totalCGST',
                'SUM(ve.sgst) AS totalSGST',
                'SUM(ve.igst) AS totalIGST',
                'br.name as branchName'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.generation_date BETWEEN :fromDate AND :toDate', { fromDate: req.fromDate, toDate: req.toDate })

        query.groupBy('ve.voucher_type')

        const results = await query.getRawMany();

        // Initialize values
        let totalSales = 0, totalPurchase = 0, totalCreditNote = 0, totalDebitNote = 0;
        let totalOutputGST = 0, totalInputGST = 0;

        // Categorize vouchers
        results.forEach(row => {
            const { voucherType, totalAmount, totalCGST, totalSGST, totalIGST } = row;
            const totalGST = totalCGST + totalSGST + totalIGST; // Total GST for this entry

            if (voucherType === VoucherTypeEnum.SALES) {
                totalSales += totalAmount;
                totalOutputGST += totalGST;
            } else if (voucherType === VoucherTypeEnum.PURCHASE) {
                totalPurchase += totalAmount;
                totalInputGST += totalGST;
            } else if (voucherType === VoucherTypeEnum.CREDITNOTE) {
                totalCreditNote += totalAmount;
            } else if (voucherType === VoucherTypeEnum.DEBITNOTE) {
                totalDebitNote += totalAmount;
            }
        });

        // Calculate net taxable sales and purchases
        const netSales = totalSales - totalCreditNote;  // Reduce sales by credit notes
        const netPurchases = totalPurchase + totalDebitNote;

        // Final GST Payable Calculation
        const gstPayable = totalOutputGST - totalInputGST;

        return {
            GSTR1: {
                totalSales,
                totalCreditNote,
                totalDebitNote,
                netTaxableSales: netSales,
                outputGST: totalOutputGST
            },
            GSTR3B: {
                totalPurchase,
                totalCreditNote,
                totalDebitNote,
                netPurchases,
                inputGST: totalInputGST,
                gstPayable
            }
        };
    }

    // async calculateBalanceSheet(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string }) {
    //     let balanceSheet = {
    //         assets: 0,
    //         liabilities: 0,
    //         income: 0,
    //         expenses: 0,
    //         capital: 0
    //     };

    //     req.forEach(txn => {
    //         switch (txn.accountType) {
    //             case UnderPrimary.ASSETS:
    //                 balanceSheet.assets += txn.amount;
    //                 break;
    //             case UnderPrimary.LIABILITIES:
    //                 balanceSheet.liabilities += txn.amount;
    //                 break;
    //             case UnderPrimary.INCOME:
    //                 balanceSheet.income += txn.amount;
    //                 break;
    //             case UnderPrimary.EXPENSES:
    //                 balanceSheet.expenses -= txn.amount;
    //                 break;
    //         }
    //     });

    //     balanceSheet.capital = balanceSheet.assets - balanceSheet.liabilities;
    //     return balanceSheet;
    // }

    //Reports


    async getTrialBalance(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        // Fetch all ledger transactions within the date range
        const query = this.createQueryBuilder('ve')
            .select([
                'ledger.group AS groupName',
                // 'ledger.name AS ledgerName',
                `SUM(CASE 
                    WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount 
                    ELSE 0 
                END) AS debitAmount`,
                `SUM(CASE 
                    WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount 
                    ELSE 0 
                END) AS creditAmount`
            ])
            .leftJoin(LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
        // .andWhere('ve.generation_date BETWEEN :fromDate AND :toDate', {
        //     fromDate: req.fromDate,
        //     toDate: req.toDate
        // });
        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        // Apply branch name filter if provided
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        const ledgerTransactions = await query
            .groupBy('ledger.group')
            .setParameters({
                debitVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE],
                creditVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE]
            })
            .getRawMany();
        console.log(ledgerTransactions, ">>>>>>>>")
        // Define the structure of the Trial Balance
        const trialBalance = {
            assets: [],
            liabilities: [],
            expenses: [],
            income: [],
            suspenseAccount: []
        };

        // Categorize Ledgers
        ledgerTransactions.forEach(({ groupName, ledgerName, debitAmount, creditAmount }) => {
            if ([
                UnderSecondary.CURRENT_ASSETS,
                UnderSecondary.LOANS_AND_ADVANCES,
                UnderSecondary.CASH_IN_HAND,
                UnderSecondary.BANK_ACCOUNTS,
                UnderSecondary.DEPOSITS,
                UnderSecondary.STOCK_IN_HAND,
                UnderSecondary.SUNDRY_DEBTORS,
                UnderSecondary.FIXED_ASSETS,
                UnderSecondary.INVESTMENTS,
                UnderSecondary.Miscellaneous_EXPENSES
            ].includes(groupName)) {
                trialBalance.assets.push({ ledgerName, groupName, debitAmount, creditAmount });
            } else if ([
                UnderSecondary.CURRENT_LIABILITIES,
                UnderSecondary.DUTIES_AND_TAXES,
                UnderSecondary.PROVISIONS,
                UnderSecondary.SUNDRY_CREDITORS,
                UnderSecondary.BRANCH_DIVISION,
                UnderSecondary.CAPITAL_ACCOUNT,
                UnderSecondary.LOANS,
                UnderSecondary.BANK_OD,
                UnderSecondary.SECURED_LOANS,
                UnderSecondary.UNSECURED_LOANS,
                UnderSecondary.RESERVES_AND_SURPLUS
            ].includes(groupName)) {
                trialBalance.liabilities.push({ ledgerName, groupName, debitAmount, creditAmount });
            } else if ([
                UnderSecondary.PURCHASE_ACCOUNT,
                UnderSecondary.Manufacturing_Expenses,
                UnderSecondary.INDIRECT_EXPENSES,
                UnderSecondary.DIRECT_EXPENSES
            ].includes(groupName)) {
                trialBalance.expenses.push({ ledgerName, groupName, debitAmount, creditAmount });
            } else if ([
                UnderSecondary.SALES_ACCOUNT,
                UnderSecondary.RETAINED_EARNINGS,
                UnderSecondary.Rental_Income,
                UnderSecondary.Interest_Income,
                UnderSecondary.Commission_Received,
                UnderSecondary.DIRECT_INCOMES
            ].includes(groupName)) {
                trialBalance.income.push({ ledgerName, groupName, debitAmount, creditAmount });
            } else if (groupName === UnderSecondary.SUSPENSE_ACCOUNT) {
                trialBalance.suspenseAccount.push({ ledgerName, debitAmount, creditAmount });
            }
        });
        console.log(trialBalance, "????????????????")
        return trialBalance;
    }

    async getBalanceSheet(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string, branchName?: string }) {
        const query = this.createQueryBuilder('ve')
            .select([
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'SUM(CASE WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount ELSE 0 END) AS debitAmount',
                'SUM(CASE WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount ELSE 0 END) AS creditAmount'
            ])
            .leftJoin(LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.generation_date BETWEEN :fromDate AND :toDate', {
                fromDate: req.fromDate,
                toDate: req.toDate
            })
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        query.groupBy('ledger.group, ledger.name')
            .setParameters({
                debitVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE],
                creditVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE]
            });

        const ledgerTransactions = await query.getRawMany();

        const balanceSheet = {
            assets: [],
            liabilities: [],
            equity: []
        };

        ledgerTransactions.forEach(({ groupName, ledgerName, debitAmount, creditAmount }) => {
            const netAmount = debitAmount - creditAmount; // Adjust based on accounting rules

            // Categorize as Assets
            if ([
                UnderSecondary.CURRENT_ASSETS,
                UnderSecondary.LOANS_AND_ADVANCES,
                UnderSecondary.CASH_IN_HAND,
                UnderSecondary.BANK_ACCOUNTS,
                UnderSecondary.DEPOSITS,
                UnderSecondary.STOCK_IN_HAND,
                UnderSecondary.SUNDRY_DEBTORS,
                UnderSecondary.FIXED_ASSETS,
                UnderSecondary.INVESTMENTS,
                UnderSecondary.Miscellaneous_EXPENSES
            ].includes(groupName)) {
                balanceSheet.assets.push({ groupName, ledgerName, amount: netAmount });
            }

            // Categorize as Liabilities
            else if ([
                UnderSecondary.CURRENT_LIABILITIES,
                UnderSecondary.DUTIES_AND_TAXES,
                UnderSecondary.PROVISIONS,
                UnderSecondary.SUNDRY_CREDITORS,
                UnderSecondary.BRANCH_DIVISION,
                UnderSecondary.LOANS,
                UnderSecondary.BANK_OD,
                UnderSecondary.SECURED_LOANS,
                UnderSecondary.UNSECURED_LOANS
            ].includes(groupName)) {
                balanceSheet.liabilities.push({ groupName, ledgerName, amount: netAmount });
            }

            // Categorize as Equity
            else if ([UnderSecondary.CAPITAL_ACCOUNT, UnderSecondary.RESERVES_AND_SURPLUS].includes(groupName)) {
                balanceSheet.equity.push({ groupName, ledgerName, amount: netAmount });
            }
        });

        // **Balance Sheet Equation Validation (Assets = Liabilities + Equity)**
        const totalAssets = balanceSheet.assets.reduce((sum, item) => sum + item.amount, 0);
        const totalLiabilities = balanceSheet.liabilities.reduce((sum, item) => sum + item.amount, 0);
        const totalEquity = balanceSheet.equity.reduce((sum, item) => sum + item.amount, 0);

        // if (totalAssets !== totalLiabilities + totalEquity) {
        //     throw new Error("Balance Sheet is not balanced!");
        // }

        return balanceSheet;
    }

    // async calculateRcs(req: {
    //     companyCode: string;
    //     unitCode: string;
    //     fromDate: string;
    //     toDate: string;
    //     branchName?: string
    // }) {
    //     // Fetch all ledger transactions within the date range
    //     const query = this.createQueryBuilder('ve')
    //         .select([
    //             'ledger.name AS supplierName',
    //             'ledger.registration_type AS registrationType',
    //             've.amount AS amount',
    //             've.voucher_type AS voucherType',
    //             've.sgst AS SGST',
    //             've.cgst AS CGST',
    //             've.igst AS IGST',
    //             '(ve.cgst + ve.sgst + ve.igst) AS totalTaxAmount', // Calculate total GST
    //             // '(ve.amount * (ve.cgst + ve.sgst + ve.igst) / 100) AS rcsTaxAmount'
    //         ])
    //         .leftJoin(LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
    //         .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
    //         .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .andWhere('ledger.registration_type = :registrationType', { registrationType: RegistrationType.UNREGISTERED })
    //         .andWhere('ve.voucher_type IN (:...voucherTypes)', { voucherTypes: [VoucherTypeEnum.PURCHASE, VoucherTypeEnum.DEBITNOTE] });

    //     if (req.fromDate) {
    //         query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
    //     }
    //     if (req.toDate) {
    //         query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
    //     }
    //     if (req.branchName) {
    //         query.andWhere('br.name = :branchName', { branchName: req.branchName });
    //     }

    //     return await query.getRawMany();  // Execute query and return results
    // }

    async getSalesReturns(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string, branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.invoice_id AS invoiceNumber',
                'sr.voucher_type AS voucherType',
                'sr.amount AS totalAmount',
                'sr.voucher_gst AS gstAmount',
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'br.name as branchName',
                'MAX(sr.due_date) AS lastDueDate' // Aggregated column
            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type = :voucherType', { voucherType: 'Sales' })
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('sr.invoice_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.amount')
            .addGroupBy('sr.voucher_gst')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name'); // Correct way to add multiple groupings

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        return await query.getRawMany();
    }


    async getTDSReport(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.invoice_id AS invoiceNumber',
                'sr.voucher_id AS voucherId',
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',  // Use SUM() to aggregate amounts
                'SUM(sr.tds) AS tdsPercentage',   // Aggregate TDS percentage
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'ledger.tds_deductable AS tdsDeductable',
                'br.name as branchName',
                'sr.payment_type as paymentType'
            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['Sales', 'PURCHASE'] })
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('sr.invoice_id')  // Group by invoice ID
            .addGroupBy('sr.generation_date')
            .addGroupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        return await query.getRawMany();
    }

    async getTCSReport(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.invoice_id AS invoiceNumber',
                'sr.voucher_id AS voucherId',
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',  // Use SUM() to aggregate amounts
                'SUM(sr.tcs) AS tdsPercentage',   // Aggregate TCS percentage
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'ledger.tcs_deductable AS tcsDeductable',
                'br.name as branchName',
                'sr.payment_type as paymentType'
            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['Sales', 'PURCHASE'] })
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('sr.invoice_id')  // Group by invoice ID
            .addGroupBy('sr.generation_date')
            .addGroupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        return await query.getRawMany();
    }

    async getDEBITNOTEReport(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.voucher_id AS voucherId',
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',  // Aggregate totalAmount
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'br.name as branchName',
                'sr.payment_type as paymentType'
            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['DEBITNOTE'] })  // Corrected condition
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // Add GROUP BY for aggregation
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');

        return await query.getRawMany();
    }

    async getCREDITNOTEReport(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.voucher_id AS voucherId',
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',  // Aggregate totalAmount
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'br.name as branchName',
                'sr.payment_type as paymentType'
            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['CREDITNOTE'] })  // Corrected condition
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // Add GROUP BY for aggregation
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');

        return await query.getRawMany();
    }

    async getJOURNALReport(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.voucher_id AS voucherId',
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',  // Aggregate totalAmount
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'br.name as branchName',
                'sr.payment_type as paymentType',

            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['JOURNAL'] })  // Corrected condition
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // Add GROUP BY for aggregation
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');

        return await query.getRawMany();
    }

    async getPURCHASEReport(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.voucher_id AS voucherId',
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',  // Aggregate totalAmount
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'br.name as branchName',
                'sr.payment_type as paymentType',
                'MAX(ve.due_date) AS lastDueDate'

            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['PURCHASE'] })  // Corrected condition
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // Add GROUP BY for aggregation
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');

        return await query.getRawMany();
    }

    async getSALESReport(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.voucher_id AS voucherId',
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',  // Aggregate totalAmount
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'br.name as branchName',
                'sr.payment_type as paymentType',
                'MAX(ve.due_date) AS lastDueDate'

            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['SALES'] })  // Corrected condition
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // Add GROUP BY for aggregation
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');

        return await query.getRawMany();
    }

    async getLedgerReport(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.voucher_id AS voucherId',
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',  // Aggregate total amount per ledger
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'br.name AS branchName',
                'sr.payment_type AS paymentType',
                'MAX(ve.due_date) AS lastDueDate'

            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // If aggregating, group by relevant columns
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');

        return await query.getRawMany();
    }

    async getPayableAmountForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS "date"`,
                `ve.voucher_id AS "voucherId"`,
                `ve.purpose AS "purpose"`,
                `branch.name AS "branchName"`,
                `ledger.name AS "ledgerName"`,
                `SUM(ve.amount) AS "totalAmount"`,
                `COUNT(ve.voucher_id) AS "pendingInvoices"`,
                `MAX(ve.due_date) AS "lastDueDate"`,
                `CASE  
                    WHEN ve.due_date < CURRENT_DATE THEN DATEDIFF(CURRENT_DATE, ve.due_date)  
                    ELSE NULL  
                END AS "overdueDays"` // Calculate overdue days only for past due dates
            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .leftJoin('ledger', 'ledger', 'ledger.id = ve.ledger_id') // Joining ledger to track payables
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.payment_status = :pendingStatus', { pendingStatus: PaymentStatus.PENDING })
            .andWhere('ve.voucher_type = :voucherType', { voucherType: VoucherTypeEnum.PURCHASE });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        // Grouping payables by branch, ledger, and date
        query
            .groupBy('ve.generation_date')
            .addGroupBy('ve.voucher_id')
            .addGroupBy('ve.purpose')
            .addGroupBy('branch.name')
            .addGroupBy('ledger.name')
            .addGroupBy('ve.due_date')
            .orderBy('ve.generation_date', 'ASC')
            .addOrderBy('branch.name', 'ASC');

        return await query.getRawMany();
    }


    async generateIncomeStatement(req: {
        year?: number
    }) {
        // Revenue: Only consider SALES (not RECEIPT to avoid double counting)
        const netSales = await this.getTotalByVoucherType(VoucherTypeEnum.SALES, req.year);

        // Other income (Journals)
        const otherIncome = await this.getTotalByVoucherType(VoucherTypeEnum.JOURNAL, req.year);

        // Expenses: Only consider PURCHASE (not PAYMENT to avoid double counting)
        const costOfSales = await this.getTotalByVoucherType(VoucherTypeEnum.PURCHASE, req.year);

        // Adjustments
        const debitNotes = await this.getTotalByVoucherType(VoucherTypeEnum.DEBITNOTE, req.year);
        const creditNotes = await this.getTotalByVoucherType(VoucherTypeEnum.CREDITNOTE, req.year);
        const interestExpense = await this.getTotalByVoucherType(VoucherTypeEnum.CONTRA, req.year);

        // Calculations
        const grossProfit = netSales - costOfSales;
        const operatingExpenses = debitNotes; // Only DEBITNOTE as an extra expense
        const incomeBeforeTaxes = grossProfit - operatingExpenses + creditNotes + otherIncome - interestExpense;
        const incomeTaxExpense = incomeBeforeTaxes * 0.30; // 30% tax assumption
        const netIncome = incomeBeforeTaxes - incomeTaxExpense;

        // Return the generated income statement
        return {

            netSales,
            costOfSales,
            grossProfit,
            operatingExpenses,
            interestExpense,
            otherIncome,
            incomeBeforeTaxes,
            incomeTaxExpense,
            netIncome,
        };
    }


    private async getTotalByVoucherType(voucherType: VoucherTypeEnum, year: number): Promise<number> {
        const result = await this
            .createQueryBuilder('voucher')
            .select('SUM(voucher.amount)', 'total')
            .where('voucher.voucherType = :voucherType', { voucherType })
            .andWhere('YEAR(voucher.date) = :year', { year })
            .getRawOne();

        return result?.total ?? 0;
    }

    async getCashFlow(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string
    }) {
        const query = this.createQueryBuilder('sr')
            .select([
                'sr.voucher_type AS voucherType',
                'SUM(sr.amount) AS totalAmount',
                'sr.generation_date AS generationDate',
                'ledger.group AS groupName',
                'ledger.name AS ledgerName',
                'br.name AS branchName',
                'sr.payment_type AS paymentType',
            ])
            .leftJoin(LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('DATE(sr.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(sr.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // Grouping by relevant fields
        query.groupBy('sr.voucher_type')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type')
            .addGroupBy('sr.generation_date');

        // Execute query
        const results = await query.getRawMany();

        // Initialize cash flow variables
        let cashInflow = 0;
        let cashOutflow = 0;

        // Iterate through results and calculate cash flow  VoucherTypeEnum.SALES, VoucherTypeEnum.PURCHASE,
        results.forEach((txn) => {
            const amount = parseFloat(txn.totalAmount) || 0;
            if ([VoucherTypeEnum.RECEIPT, VoucherTypeEnum.CREDITNOTE].includes(txn.voucherType)) {
                cashInflow += amount;
            } else if ([VoucherTypeEnum.PAYMENT, VoucherTypeEnum.DEBITNOTE].includes(txn.voucherType)) {
                cashOutflow += amount;
            }
        });

        // Calculate net cash flow
        const netCashFlow = cashInflow - cashOutflow;

        return { cashInflow, cashOutflow, netCashFlow, transactions: results };
    }

    async getBankReconciliationReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        bankAccount?: string;
    }) {
        const query = this.createQueryBuilder('txn')
            .select([
                'txn.voucher_type AS voucherType',
                'txn.amount AS amount',
                'txn.payment_type AS paymentType',
                'txn.generation_date AS transactionDate',
                'ledger.name AS ledgerName',
                'bank.account_name AS bankAccountName',
                'bank.account_number AS bankAccountNumber',
                'bank.total_amount AS amountAccount',
                'bank.ifsc_code AS ifscCode',
                'txn.payment_status AS transactionStatus'
            ])
            .leftJoin(LedgerEntity, 'ledger', 'txn.ledger_id = ledger.id')
            .leftJoin(AccountEntity, 'bank', 'txn.from_account_id = bank.id')
            .where('txn.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('txn.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('txn.payment_type = :paymentType', { paymentType: PaymentType.BANK });

        if (req.fromDate) {
            query.andWhere('DATE(txn.generation_date) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(txn.generation_date) <= :toDate', { toDate: req.toDate });
        }

        if (req.bankAccount) {
            query.andWhere('bank.account_number = :bankAccount', { bankAccount: req.bankAccount });
        }

        const transactions = await query.getRawMany();

        // Calculate bank reconciliation data
        let bankBalance = 0;
        let totalReceipts = 0;
        let totalPayments = 0;
        let depositsInTransit = 0;
        let outstandingChecks = 0;
        let bankCharges = 0;

        transactions.forEach((txn) => {
            if ([VoucherTypeEnum.RECEIPT, VoucherTypeEnum.CREDITNOTE].includes(txn.voucherType)) {
                totalReceipts += txn.amount;
                if (txn.transactionStatus === 'PENDING' && VoucherTypeEnum.SALES) {
                    depositsInTransit += txn.amount;
                }
            } else if ([VoucherTypeEnum.PAYMENT, VoucherTypeEnum.DEBITNOTE].includes(txn.voucherType)) {
                totalPayments += txn.amount;
                if (txn.transactionStatus === 'PENDING' && VoucherTypeEnum.PURCHASE) {
                    outstandingChecks += txn.amount;
                }
            } else if (txn.voucherType === VoucherTypeEnum.CONTRA && txn.paymentType === PaymentType.BANK) {
                bankCharges += txn.amount;
            }
        });

        // Calculate adjusted bank balance
        bankBalance = totalReceipts - totalPayments - bankCharges;

        return {
            bankBalance,
            totalReceipts,
            totalPayments,
            depositsInTransit,
            outstandingChecks,
            bankCharges,
            transactions
        };
    }



    async getBankStmtForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        bankAccountNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS "date"`,
                `ve.voucher_id AS "voucherId"`,
                `ve.purpose AS "purpose"`,
                `ve.voucher_type AS "voucherType"`,
                `branch.name AS "branchName"`,
                `ledger.name AS "ledgerName"`,
                `SUM(ve.amount) AS "totalAmount"`,
                `fromBank.account_name AS "fromBankAccountName"`,
                `fromBank.account_number AS "fromBankAccountNumber"`,
                `fromBank.total_amount AS "fromBankTotalAmount"`,
                `fromBank.account_type AS "fromBankAccountType"`,
                `fromBank.ifsc_code AS "fromBankifscCode"`,
                `fromBank.account_type AS "fromBankAccountType"`,
                `fromBank.ifsc_code AS "fromBankifscCode"`,
                `fromBank.address AS "fromBankaddress"`,
                `fromBank.phone_number AS "fromBankphoneNumber"`,
                `toBank.phone_number AS "toBankphoneNumber"`,
                `toBank.total_amount AS "toBankTotalAmount"`,
                `toBank.account_type AS "toBankAccountType"`,
                `toBank.ifsc_code AS "toBankifscCode"`,
                `toBank.address AS "toBankaddress"`,
                `toBank.account_name AS "toBankAccountName"`,
                `toBank.account_number AS "toBankAccountNumber"`,
                'SUM(CASE WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount ELSE 0 END) AS debitAmount',
                'SUM(CASE WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount ELSE 0 END) AS creditAmount'

            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .leftJoin(AccountEntity, 'fromBank', 've.from_account_id = fromBank.id') // Join for from_account
            .leftJoin(AccountEntity, 'toBank', 've.to_account_id = toBank.id') // Join for to_account
            .leftJoin(LedgerEntity, 'ledger', 'ledger.id = ve.ledger_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.payment_type != :paymentType', { paymentType: PaymentType.CASH });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }
        if (req.bankAccountNumber) {
            query.andWhere('(fromBank.account_number = :bankAccountNumber OR toBank.account_number = :bankAccountNumber)', {
                bankAccountNumber: req.bankAccountNumber
            });
        }

        query
            .groupBy('ve.generation_date')
            .addGroupBy('ve.voucher_id')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.voucher_type')
            .addGroupBy('branch.name')
            .addGroupBy('ledger.name')
            .addGroupBy('fromBank.account_name')
            .addGroupBy('fromBank.account_number')
            .addGroupBy('toBank.account_name')
            .addGroupBy('toBank.account_number')
            .addGroupBy('ve.due_date')
            .setParameters({
                debitVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE],
                creditVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE]
            })
            .orderBy('ve.generation_date', 'ASC')
            .addOrderBy('branch.name', 'ASC');

        return await query.getRawMany();
    }


    async getCashStmtForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                `DATE(ve.generation_date) AS "date"`,
                `ve.voucher_id AS "voucherId"`,
                `ve.purpose AS "purpose"`,
                `ve.voucher_type AS "voucherType"`,
                `branch.name AS "branchName"`,
                `ledger.name AS "ledgerName"`,
                `SUM(ve.amount) AS "totalAmount"`,
            ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .leftJoin(LedgerEntity, 'ledger', 'ledger.id = ve.ledger_id') // Ledger to track payables
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.payment_type = :paymentType', { paymentType: PaymentType.CASH });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        query
            .groupBy('ve.generation_date')
            .addGroupBy('ve.voucher_id')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.voucher_type')
            .addGroupBy('branch.name')
            .addGroupBy('ledger.name')
            .orderBy('ve.generation_date', 'ASC')
            .addOrderBy('branch.name', 'ASC');

        return await query.getRawMany();
    }

    async getLoansAndInterestsForReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                'ledger.group AS "groupName"',
                'ledger.name AS "ledgerName"',  // Uncommented to avoid undefined errors
                `COALESCE(SUM(CASE 
                    WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount 
                    ELSE 0 
                END), 0) AS "debitAmount"`,
                `COALESCE(SUM(CASE 
                    WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount 
                    ELSE 0 
                END), 0) AS "creditAmount"`
            ])
            .leftJoin(LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        const ledgerTransactions = await query
            .groupBy('ledger.group')
            .addGroupBy('ledger.name')  // Needed to match selected fields
            .setParameters({
                debitVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE],
                creditVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE]
            })
            .getRawMany();

        console.log(ledgerTransactions, ">>>>>>>>");

        // **Define the structured response**
        const loansandinterstAmounts = {
            loans: [],
            interest: [],  // Fixed typo: "interst" -> "interest"
        };

        // **Categorize Ledgers**
        ledgerTransactions.forEach(({ groupName, ledgerName, debitAmount, creditAmount }) => {
            if ([
                UnderSecondary.LOANS,
                UnderSecondary.LOANS_AND_ADVANCES,
                UnderSecondary.CASH_IN_HAND,
                UnderSecondary.SECURED_LOANS,
                UnderSecondary.UNSECURED_LOANS,
            ].includes(groupName)) {
                loansandinterstAmounts.loans.push({ ledgerName, groupName, debitAmount, creditAmount });
            } else if ([UnderSecondary.Interest_Income].includes(groupName)) {
                loansandinterstAmounts.interest.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
        });

        return loansandinterstAmounts;
    }

    async getFixedAssertsForReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                'ledger.group AS "groupName"',
                'ledger.name AS "ledgerName"',  // Uncommented to avoid undefined errors
                `COALESCE(SUM(CASE 
                    WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount 
                    ELSE 0 
                END), 0) AS "debitAmount"`,
                `COALESCE(SUM(CASE 
                    WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount 
                    ELSE 0 
                END), 0) AS "creditAmount"`
            ])
            .leftJoin(LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        const ledgerTransactions = await query
            .groupBy('ledger.group')
            .addGroupBy('ledger.name')  // Needed to match selected fields
            .setParameters({
                debitVouchers: [VoucherTypeEnum.PAYMENT, VoucherTypeEnum.CREDITNOTE],
                creditVouchers: [VoucherTypeEnum.RECEIPT, VoucherTypeEnum.DEBITNOTE]
            })
            .getRawMany();

        console.log(ledgerTransactions, ">>>>>>>>");

        // **Define the structured response**
        const loansandinterstAmounts = {
            asserts: [],
            // interest: [],  // Fixed typo: "interst" -> "interest"
        };

        // **Categorize Ledgers**
        ledgerTransactions.forEach(({ groupName, ledgerName, debitAmount, creditAmount }) => {
            if ([
                UnderSecondary.FIXED_ASSETS
            ].includes(groupName)) {
                loansandinterstAmounts.asserts.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
        });

        return loansandinterstAmounts;
    }

    async getProfitAndLoss(req: { companyCode: string; unitCode: string; fromDate: string; toDate: string; branchName?: string }) {
        const query = this.createQueryBuilder('ve')
            .select([
                'ledger.group AS "groupName"',
                'ledger.name AS "ledgerName"',
                `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:...purchaseVouchers) THEN ve.amount ELSE 0 END), 0) AS "purchaseAmount"`,
                `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:...salesVouchers) THEN ve.amount ELSE 0 END), 0) AS "salesAmount"`,
                `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:...directExpenseVouchers) THEN ve.amount ELSE 0 END), 0) AS "directExpenseAmount"`,
                `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:...indirectExpenseVouchers) THEN ve.amount ELSE 0 END), 0) AS "indirectExpenseAmount"`,
                `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:...indirectIncomeVouchers) THEN ve.amount ELSE 0 END), 0) AS "indirectIncomeAmount"`
            ])
            .leftJoin(LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('ve.generation_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.generation_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        const profitAndLoss = await query
            .groupBy('ledger.group')
            .addGroupBy('ledger.name')
            .setParameters({
                purchaseVouchers: [VoucherTypeEnum.PAYMENT],
                salesVouchers: [VoucherTypeEnum.RECEIPT],
                indirectExpenseVouchers: [VoucherTypeEnum.JOURNAL],
                indirectIncomeVouchers: [VoucherTypeEnum.CREDITNOTE]
            })
            .getRawMany();

        return {
            directExpenses: profitAndLoss.filter(p => p.directExpenseAmount > 0),
            purchases: profitAndLoss.filter(p => p.purchaseAmount > 0),
            sales: profitAndLoss.filter(p => p.salesAmount > 0),
            indirectExpenses: profitAndLoss.filter(p => p.indirectExpenseAmount > 0),
            indirectIncomes: profitAndLoss.filter(p => p.indirectIncomeAmount > 0)
        };
    }

}


