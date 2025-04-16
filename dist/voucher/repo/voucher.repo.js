"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherRepository = void 0;
const common_1 = require("@nestjs/common");
const account_entity_1 = require("../../account/entity/account.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const client_entity_1 = require("../../client/entity/client.entity");
const estimate_entity_1 = require("../../estimate/entity/estimate.entity");
const payment_status_enum_1 = require("../../product/dto/payment-status.enum");
const product_entity_1 = require("../../product/entity/product.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
const vendor_entity_1 = require("../../vendor/entity/vendor.entity");
const typeorm_1 = require("typeorm");
const voucher_entity_1 = require("../entity/voucher.entity");
const voucher_type_enum_1 = require("../enum/voucher-type-enum");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const payment_type_enum_1 = require("../../asserts/enum/payment-type.enum");
const ledger_entity_1 = require("../../ledger/entity/ledger.entity");
const groups_entity_1 = require("../../groups/entity/groups.entity");
let VoucherRepository = class VoucherRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(voucher_entity_1.VoucherEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getInVoiceData(req) {
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
            .leftJoinAndSelect(client_entity_1.ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoinAndSelect(estimate_entity_1.EstimateEntity, 'es', 've.invoice_id = es.invoice_id')
            .leftJoinAndSelect(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
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
    async getDetailInVoiceData(req) {
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
            .leftJoinAndSelect(client_entity_1.ClientEntity, 'cl', 'cl.client_id = ve.id')
            .leftJoinAndSelect(estimate_entity_1.EstimateEntity, 'es', 've.invoice_id = es.invoice_id')
            .leftJoinAndSelect(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(product_entity_1.ProductEntity, 'pr', 've.product=pr.id')
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
            .addGroupBy('es.id')
            .getRawOne();
        return query;
    }
    async getReceiptDataForReport(filters) {
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
            .leftJoinAndSelect(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(client_entity_1.ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoinAndSelect(estimate_entity_1.EstimateEntity, 'es', 've.invoice_id = es.id')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.RECEIPT })
            .andWhere(`ve.company_code = "${filters.companyCode}"`)
            .andWhere(`ve.unit_code = "${filters.unitCode}"`);
        query.andWhere('ve.voucher_id = :voucherId', { voucherId: filters.voucherId });
        const result = await query.getRawMany();
        return result;
    }
    async getReceiptData(filters) {
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
            .leftJoinAndSelect(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(client_entity_1.ClientEntity, 'cl', 've.client_id = cl.id')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.RECEIPT })
            .andWhere(`ve.company_code = "${filters.companyCode}"`)
            .andWhere(`ve.unit_code = "${filters.unitCode}"`);
        if (filters.voucherId) {
            query.andWhere('ve.voucher_id = :voucherId', { voucherId: filters.voucherId });
        }
        if (filters.clientName) {
            query.andWhere('cl.name LIKE :clientName', { clientName: `%${filters.clientName}%` });
        }
        if (filters.paymentStatus) {
            query.andWhere('ve.payment_status = :paymentStatus', { paymentStatus: filters.paymentStatus });
        }
        const result = await query.getRawMany();
        return result;
    }
    async getPaymentData(filters) {
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
            .leftJoin(client_entity_1.ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoin(account_entity_1.AccountEntity, 'ac', 'ac.id=ve.to_account_id')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.PAYMENT })
            .andWhere(`ve.company_code = "${filters.companyCode}"`)
            .andWhere(`ve.unit_code = "${filters.unitCode}"`);
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
        try {
            const result = await query.getRawMany();
            return result;
        }
        catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }
    async getPurchaseData(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
            .leftJoin(vendor_entity_1.VendorEntity, 'vn', 've.vendor_id=vn.id')
            .leftJoin(client_entity_1.ClientEntity, 'cl', 've.client_id = cl.id')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.PURCHASE })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .getRawMany();
        return query;
    }
    async getClientPurchaseOrderDataTable(req) {
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
            .leftJoin(product_entity_1.ProductEntity, 'pa', 've.product_id = pa.id')
            .leftJoin(client_entity_1.ClientEntity, 'cl', 've.client_id = cl.id')
            .where('ve.voucher_type IN (:...types)', { types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE] })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
        query.andWhere('cl.phone_number = :phoneNumber', { phoneNumber: req.phoneNumber });
        query.groupBy('cl.client_id')
            .addGroupBy('cl.name')
            .addGroupBy('cl.phone_number')
            .addGroupBy('cl.address')
            .addGroupBy('cl.address')
            .addGroupBy('ve.voucher_id');
        const result = await query.getRawMany();
        return result;
    }
    async getAllVouchers(req) {
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
            .leftJoinAndSelect(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoinAndSelect(client_entity_1.ClientEntity, 'cl', 've.client_id = cl.id')
            .where(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
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
            .addGroupBy('ve.name');
        const result = await query.getRawMany();
        return result;
    }
    async getMonthWiseBalance(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', { types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE] })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date), MONTHNAME(ve.generation_date), branch.name');
        const rawData = await query.getRawMany();
        const groupedData = rawData.reduce((acc, item) => {
            const branchName = item.branchName || "Unknown Branch";
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
        const formattedResponse = Object.keys(groupedData).map(branchName => ({
            branchName,
            data: groupedData[branchName],
        }));
        return formattedResponse;
    }
    async getYearWiseCreditAndDebitPercentages(req) {
        const year = Number(req.date);
        if (!year || isNaN(year)) {
            throw new Error('Invalid year provided');
        }
        const query = this.createQueryBuilder('ve')
            .select([
            `YEAR(ve.generation_date) AS year`,
            `MONTH(ve.generation_date) AS month`,
            `MONTHNAME(ve.generation_date) AS monthName`,
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
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE]
        })
            .andWhere('YEAR(ve.generation_date) = :year', { year })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date), MONTHNAME(ve.generation_date)')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .getRawMany();
        return query;
    }
    async get4YearWiseCreditAndDebitPercentages(req) {
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
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE]
        })
            .andWhere('YEAR(ve.generation_date) BETWEEN :startYear AND :endYear', {
            startYear: year - 3,
            endYear: year
        })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date)')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .getRawMany();
        return query;
    }
    async getTotalProductAndServiceSales(req) {
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
    async getTotalSalesForReport(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            `DATE(ve.generation_date) AS date`,
            `branch.name AS branchName`,
            `SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END) AS serviceSales`,
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
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
        const data = await query
            .groupBy('DATE(ve.generation_date)')
            .addGroupBy('branch.id')
            .addGroupBy('branch.name')
            .orderBy('DATE(ve.generation_date)', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .getRawMany();
        return data;
    }
    async getDayBookData(req) {
        const debitVouchers = [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE];
        const creditVouchers = [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE];
        const allVouchers = [...new Set([...debitVouchers, ...creditVouchers])];
        const query = this.createQueryBuilder('ve')
            .select([
            `DATE_FORMAT(ve.generation_date, '%Y-%m') AS date`,
            `ve.voucher_id AS voucherId`,
            `ve.voucher_type AS voucherType`,
            `ve.purpose AS purpose`,
            `SUM(CASE WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount ELSE 0 END) AS debitAmount`,
            `SUM(CASE WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount ELSE 0 END) AS creditAmount`,
            `SUM(CASE WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount ELSE 0 END) - 
                 SUM(CASE WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount ELSE 0 END) AS balanceAmount`
        ])
            .where('DATE_FORMAT(ve.generation_date, "%Y-%m") = :date')
            .andWhere('ve.company_code = :companyCode')
            .andWhere('ve.unit_code = :unitCode')
            .andWhere('ve.voucher_type IN (:...allVouchers)')
            .groupBy(`
                DATE_FORMAT(ve.generation_date, '%Y-%m'),
                ve.voucher_id,
                ve.voucher_type,
                ve.purpose
            `)
            .orderBy('date', 'ASC')
            .addOrderBy('ve.voucher_type', 'ASC')
            .setParameters({
            debitVouchers,
            creditVouchers,
            allVouchers,
            date: req.date,
            companyCode: req.companyCode,
            unitCode: req.unitCode,
        });
        const rawQuery = query.getQuery();
        console.log(rawQuery);
        console.log(query.getParameters());
        const result = await query.getRawMany();
        console.log(result);
        return result;
    }
    async getDayBookDataForReport(req) {
        const debitVouchers = [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE];
        const creditVouchers = [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE];
        const allVouchers = [...new Set([...debitVouchers, ...creditVouchers])];
        const query = this.createQueryBuilder('ve')
            .select([
            `ve.generation_date AS generationDate`,
            `DATE_FORMAT(ve.generation_date, '%Y-%m') AS date`,
            `ve.voucher_id AS voucherId`,
            `ve.voucher_type AS voucherType`,
            `ve.purpose AS purpose`,
            `SUM(CASE WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount ELSE 0 END) AS debitAmount`,
            `SUM(CASE WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount ELSE 0 END) AS creditAmount`,
            `SUM(CASE WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount ELSE 0 END) - 
                 SUM(CASE WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount ELSE 0 END) AS balanceAmount`,
            `branch.name AS branchName`
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...allVouchers)')
            .andWhere('ve.company_code = :companyCode')
            .andWhere('ve.unit_code = :unitCode');
        if (req.fromDate) {
            query.andWhere(`ve.generation_date >= :fromDate`);
        }
        if (req.toDate) {
            query.andWhere(`ve.generation_date <= :toDate`);
        }
        if (req.branchName) {
            query.andWhere('branch.name = :branchName');
        }
        query.groupBy(`
            YEAR(ve.generation_date), 
            MONTH(ve.generation_date), 
            DATE(ve.generation_date), 
            ve.voucher_id, 
            ve.purpose,
            branch.name
        `)
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .addOrderBy('ve.voucher_type', 'ASC');
        const parameters = {
            debitVouchers,
            creditVouchers,
            allVouchers,
            companyCode: req.companyCode,
            unitCode: req.unitCode,
        };
        if (req.fromDate)
            parameters.fromDate = req.fromDate;
        if (req.toDate)
            parameters.toDate = req.toDate;
        if (req.branchName)
            parameters.branchName = req.branchName;
        query.setParameters(parameters);
        const data = await query.getRawMany();
        return data;
    }
    async getPurchaseCount(req) {
        const query = this.createQueryBuilder('ve')
            .select('COUNT(ve.voucher_id) AS totalPurchases')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.PURCHASE })
            .andWhere('DATE(ve.generation_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
        const last30DaysResult = await query.getRawOne();
        const weekQuery = this.createQueryBuilder('ve')
            .select('COUNT(ve.voucher_id) AS totalPurchases')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.PURCHASE })
            .andWhere('DATE(ve.generation_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
        const last7DaysResult = await weekQuery.getRawOne();
        const last30DaysPurchases = Number(last30DaysResult.totalPurchases);
        const last7DaysPurchases = Number(last7DaysResult.totalPurchases);
        let percentageChange = 0;
        if (last7DaysPurchases && last30DaysPurchases) {
            percentageChange = ((last30DaysPurchases - last7DaysPurchases) / last7DaysPurchases) * 100;
            percentageChange = Math.min(percentageChange, 100);
        }
        return {
            last30DaysPurchases: last30DaysPurchases,
            percentageChange: percentageChange.toFixed(2),
        };
    }
    async getExpansesTableData(req) {
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
            .leftJoin(client_entity_1.ClientEntity, 'cl', 've.client_id = cl.id')
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .where('ve.voucher_type IN (:...types)', {
            types: [voucher_type_enum_1.VoucherTypeEnum.JOURNAL, voucher_type_enum_1.VoucherTypeEnum.PAYMENT]
        });
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
    async getLast30DaysCreditAndDebitPercentages(req) {
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
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE]
        })
            .andWhere('ve.generation_date >= CURDATE() - INTERVAL 30 DAY')
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }
        query
            .groupBy('branch.name')
            .orderBy('branch.name', 'ASC');
        return query.getRawMany();
    }
    async getProductsPhotos(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            'pr.product_name as productName',
            'pr.product_photo as productPhoto'
        ])
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = ve.sub_dealer_id')
            .leftJoin(vendor_entity_1.VendorEntity, 'vn', 'vn.id = ve.vendor_id')
            .leftJoin(product_entity_1.ProductEntity, 'pr', 'pr.id = ve.product_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.vendorId) {
            query.andWhere('ve.vendor_id = :vendorId', { vendorId: req.vendorId });
        }
        else if (req.subDealerId) {
            query.andWhere('ve.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }
        else {
            throw new Error('Either vendorId or subDealerId must be provided.');
        }
        const results = await query.getRawMany();
        return results.map((result) => ({
            productName: result.productName,
            productPhoto: result.productPhoto
        }));
    }
    async getProductTypeCreditAndDebitPercentages(req) {
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
            `COALESCE(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) AS totalCreditAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) AS totalDebitAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END), 0) AS serviceTotalCreditAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'product' THEN ve.amount ELSE 0 END), 0) AS productTotalCreditAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'sales' THEN ve.amount ELSE 0 END), 0) AS salesTotalCreditAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'expanses' THEN ve.amount ELSE 0 END), 0) AS expansesTotalDebitAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'salaries' THEN ve.amount ELSE 0 END), 0) AS salariesTotalDebitAmount`,
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
            `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'expanses' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS expansesDebitPercentage`,
            `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'salaries' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS salariesDebitPercentage`
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', {
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE]
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
    async get4ProductTypeCreditAndDebitPercentages(req) {
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
            `COALESCE(SUM(CASE WHEN ve.product_type IN ('service', 'product', 'sales') THEN ve.amount ELSE 0 END), 0) AS totalCreditAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) AS totalDebitAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'service' THEN ve.amount ELSE 0 END), 0) AS serviceTotalCreditAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'product' THEN ve.amount ELSE 0 END), 0) AS productTotalCreditAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'sales' THEN ve.amount ELSE 0 END), 0) AS salesTotalCreditAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'expanses' THEN ve.amount ELSE 0 END), 0) AS expansesTotalDebitAmount`,
            `COALESCE(SUM(CASE WHEN ve.product_type = 'salaries' THEN ve.amount ELSE 0 END), 0) AS salariesTotalDebitAmount`,
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
            `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'expanses' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS expansesDebitPercentage`,
            `ROUND(
                    COALESCE(SUM(CASE WHEN ve.product_type = 'salaries' THEN ve.amount ELSE 0 END), 0) / 
                    NULLIF(SUM(CASE WHEN ve.product_type IN ('expanses', 'salaries') THEN ve.amount ELSE 0 END), 0) * 100, 2
                ) AS salariesDebitPercentage`
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', {
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE]
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
    async getPurchaseOrderDataTable(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            've.voucher_id AS voucherId',
            've.generation_date AS generationDate',
            've.purpose AS purpose',
            've.name AS name',
            've.quantity AS quantity',
            've.payment_status AS paymentStatus',
            'pa.product_name AS productName',
            'SUM(ve.amount) AS totalAmount'
        ])
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 've.sub_dealer_id = sb.id')
            .leftJoin(product_entity_1.ProductEntity, 'pa', 've.product_id = pa.id')
            .leftJoin(staff_entity_1.StaffEntity, 'sf', 'sf.id=ve.staff_id')
            .where('ve.voucher_type IN (:...types)', { types: [voucher_type_enum_1.VoucherTypeEnum.PURCHASE] })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
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
    async getPaymentDataTable(req) {
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
            'SUM(ve.amount) AS totalAmount'
        ])
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 've.sub_dealer_id = sb.id')
            .leftJoin(product_entity_1.ProductEntity, 'pa', 've.product_id = pa.id')
            .leftJoin(staff_entity_1.StaffEntity, 'sf', 'sf.id = ve.staff_id')
            .where('ve.voucher_type IN (:...types)', { types: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT] })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
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
    async getBranchWiseYearlySales(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.voucher_type = :salesType', { salesType: voucher_type_enum_1.VoucherTypeEnum.SALES })
            .andWhere('YEAR(ve.generation_date) = :year', { year })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name, YEAR(ve.generation_date)')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .getRawMany();
        return query;
    }
    async getBranchWiseMonthlySales(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.voucher_type = :salesType', { salesType: voucher_type_enum_1.VoucherTypeEnum.SALES })
            .andWhere('YEAR(ve.generation_date) = :year', { year })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name, YEAR(ve.generation_date), MONTH(ve.generation_date)')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .getRawMany();
        return query;
    }
    async getOverAllYearlySales(req) {
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
            .where('ve.voucher_type = :salesType', { salesType: voucher_type_enum_1.VoucherTypeEnum.SALES })
            .andWhere('YEAR(ve.generation_date) = :year', { year })
            .andWhere('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date)')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .getRawMany();
        return query;
    }
    async getTotalPayableAndReceivablePercentage(req) {
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
        if (req.date) {
            query.andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date });
        }
        if (req.branchName) {
            query.andWhere(`LOWER(branch.name) = LOWER(:branchName)`, { branchName: req.branchName });
        }
        query.groupBy('branch.id, branch.name')
            .orderBy('branch.name', 'ASC')
            .setParameter('pendingStatus', payment_status_enum_1.PaymentStatus.PENDING);
        return query.getRawMany();
    }
    async getSalesBreakdown(req) {
        const query = await this.createQueryBuilder('ve')
            .select([
            `YEAR(ve.generation_date) AS year`,
            `branch.id AS branchId`,
            `branch.name AS branchName`,
            `SUM(JSON_EXTRACT(ve.product_details, '$[*].totalCost')) AS totalSalesAmount`,
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
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .andWhere(`ve.voucher_type = 'Sales'`)
            .andWhere(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode })
            .groupBy('YEAR(ve.generation_date), branch.id, branch.name')
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .getRawMany();
        return query;
    }
    async getSalesForTable(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            `DATE(ve.generation_date) AS "date"`,
            `branch.name AS "branchName"`,
            `ve.voucher_id AS "voucherId"`,
            `ve.purpose AS "purpose"`,
            `ve.payment_type AS "paymentType"`,
            `ve.amount AS "amount"`,
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.voucher_type = :voucherType', { voucherType: voucher_type_enum_1.VoucherTypeEnum.SALES });
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
            .groupBy('ve.voucher_id')
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
    async getPayableAmountForTable(req) {
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
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'ledger.id = ve.ledger_id')
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.payment_status = :pendingStatus', { pendingStatus: payment_status_enum_1.PaymentStatus.PENDING })
            .andWhere('ve.voucher_type = :voucherType', { voucherType: voucher_type_enum_1.VoucherTypeEnum.PURCHASE });
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
            .groupBy('ve.voucher_id')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('branch.name')
            .addGroupBy('ve.amount')
            .orderBy('ve.generation_date', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .getRawMany();
        return data;
    }
    async getReceivableAmountForTable(req) {
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
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere(`ve.payment_status = :pendingStatus`, { pendingStatus: payment_status_enum_1.PaymentStatus.PENDING })
            .andWhere(`ve.voucher_type = :voucherType`, { voucherType: voucher_type_enum_1.VoucherTypeEnum.SALES });
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
            .groupBy('ve.voucher_id')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.payment_type')
            .addGroupBy('branch.name')
            .addGroupBy('ve.amount')
            .getRawMany();
        return data;
    }
    async getAllPaymentsVouchers(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
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
            .addGroupBy('ledger.name');
        return await query.getRawMany();
    }
    async getPurchaseDataForTable(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            've.voucher_id AS "purchaseId"',
            'br.name AS "branchName"',
            've.generation_date AS "generationDate"',
            've.purpose AS "purpose"',
            've.amount AS "amount"',
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.PURCHASE });
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
            .groupBy('ve.voucher_id')
            .addGroupBy('br.name')
            .addGroupBy('ve.generation_date')
            .addGroupBy('ve.purpose')
            .addGroupBy('ve.amount')
            .orderBy('ve.generation_date', 'ASC')
            .getRawMany();
        return data;
    }
    async getAmountDetails(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            `SUM(CASE WHEN ve.payment_status = 'PENDING' AND ve.voucher_type = 'SALES' THEN ve.amount ELSE 0 END) AS ReceivableAmount`,
            `SUM(CASE WHEN ve.payment_status = 'PENDING' AND ve.voucher_type = 'PURCHASE' THEN ve.amount ELSE 0 END) AS PayableAmount`,
            `SUM(CASE WHEN ve.voucher_type = 'SALES' THEN ve.amount ELSE 0 END) AS SalesAmount`,
        ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }
        return query.getRawOne();
    }
    async getVoucherAmountDetails(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            `SUM(CASE WHEN ve.payment_status = 'PENDING' THEN ve.amount ELSE 0 END) AS pendingAmount`,
            `SUM(CASE WHEN ve.payment_status = 'COMPLETED' THEN ve.amount ELSE 0 END) AS receivedAmount`
        ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }
        return query.getRawOne();
    }
    async getSolidLiquidCash(req) {
        const bankBalanceResult = await this.dataSource
            .getRepository(account_entity_1.AccountEntity)
            .createQueryBuilder('ac')
            .select('SUM(ac.total_amount)', 'bankBalance')
            .where('ac.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ac.unit_code = :unitCode', { unitCode: req.unitCode })
            .getRawOne();
        const bankTransactions = await this.dataSource
            .getRepository(voucher_entity_1.VoucherEntity)
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
            bankPayments: [payment_type_enum_1.PaymentType.BANK, payment_type_enum_1.PaymentType.UPI, payment_type_enum_1.PaymentType.CARD, payment_type_enum_1.PaymentType.cheque],
            positiveVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE],
            negativeVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
        })
            .getRawOne();
        const solidCashResult = await this.dataSource
            .getRepository(voucher_entity_1.VoucherEntity)
            .createQueryBuilder('ve')
            .select([
            `SUM(CASE 
                    WHEN ve.payment_type = :cash AND ve.voucher_type IN (:...positiveVouchers) THEN ve.amount 
                    WHEN ve.payment_type = :cash AND ve.voucher_type IN (:...negativeVouchers) THEN -ve.amount 
                    ELSE 0 
                END) AS solidCash`,
        ])
            .setParameters({
            cash: payment_type_enum_1.PaymentType.CASH,
            positiveVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE],
            negativeVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
        })
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .getRawOne();
        return {
            solidCash: parseFloat(solidCashResult?.solidCash || 0),
            liquidCash: parseFloat(bankBalanceResult?.bankBalance || 0) + parseFloat(bankTransactions?.bankTransactions || 0),
        };
    }
    async getBranchWiseSolidLiquidCash(req) {
        const liquidCashResults = await this.dataSource
            .getRepository(account_entity_1.AccountEntity)
            .createQueryBuilder('ac')
            .select([
            'br.name AS branchName',
            'SUM(ac.total_amount) AS liquidCash',
        ])
            .leftJoin('branches', 'br', 'br.id = ac.branch_id')
            .where('ac.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ac.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('br.name')
            .getRawMany();
        const bankTransactions = await this.dataSource
            .getRepository(voucher_entity_1.VoucherEntity)
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
            bankPayments: [payment_type_enum_1.PaymentType.BANK, payment_type_enum_1.PaymentType.UPI, payment_type_enum_1.PaymentType.CARD, payment_type_enum_1.PaymentType.cheque],
            positiveVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE],
            negativeVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
        })
            .getRawMany();
        const solidCashResults = await this.dataSource
            .getRepository(voucher_entity_1.VoucherEntity)
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
            cash: payment_type_enum_1.PaymentType.CASH,
            positiveVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE],
            negativeVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
        })
            .getRawMany();
        const branchWiseData = new Map();
        liquidCashResults.forEach(row => {
            branchWiseData.set(row.branchName, {
                branchName: row.branchName || 'Unknown Branch',
                liquidCash: parseFloat(row.liquidCash || '0'),
                solidCash: 0,
            });
        });
        bankTransactions.forEach(row => {
            if (!branchWiseData.has(row.branchName)) {
                branchWiseData.set(row.branchName, {
                    branchName: row.branchName || 'Unknown Branch',
                    liquidCash: 0,
                    solidCash: 0,
                });
            }
            branchWiseData.get(row.branchName).liquidCash += parseFloat(row.bankTransactions || '0');
        });
        solidCashResults.forEach(row => {
            if (!branchWiseData.has(row.branchName)) {
                branchWiseData.set(row.branchName, {
                    branchName: row.branchName || 'Unknown Branch',
                    solidCash: 0,
                    liquidCash: 0,
                });
            }
            branchWiseData.get(row.branchName).solidCash += parseFloat(row.solidCash || '0');
        });
        return Array.from(branchWiseData.values());
    }
    async getBranchWiseAccountAmounts(req) {
        const accountWiseAmounts = await this.dataSource
            .getRepository(account_entity_1.AccountEntity)
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
        const branchAccountData = {};
        accountWiseAmounts.forEach(row => {
            const branchName = row.branchName || 'Unknown Branch';
            const accountName = row.accountName || 'Unknown Account';
            const accountAmount = parseFloat(row.accountAmount || '0');
            if (!branchAccountData[branchName]) {
                branchAccountData[branchName] = {};
            }
            branchAccountData[branchName][accountName] = accountAmount;
        });
        return Object.entries(branchAccountData).map(([branch, accounts]) => ({
            [branch]: accounts,
        }));
    }
    async calculateGstReturns(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            've.voucher_type AS voucherType',
            'SUM(ve.amount) AS totalAmount',
            'SUM(ve.cgst) AS totalCGST',
            'SUM(ve.sgst) AS totalSGST',
            'SUM(ve.igst) AS totalIGST',
            'br.name as branchName'
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.generation_date BETWEEN :fromDate AND :toDate', { fromDate: req.fromDate, toDate: req.toDate });
        query.groupBy('ve.voucher_type');
        const results = await query.getRawMany();
        let totalSales = 0, totalPurchase = 0, totalCreditNote = 0, totalDebitNote = 0;
        let totalOutputGST = 0, totalInputGST = 0;
        results.forEach(row => {
            const { voucherType, totalAmount, totalCGST, totalSGST, totalIGST } = row;
            const totalGST = totalCGST + totalSGST + totalIGST;
            if (voucherType === voucher_type_enum_1.VoucherTypeEnum.SALES) {
                totalSales += totalAmount;
                totalOutputGST += totalGST;
            }
            else if (voucherType === voucher_type_enum_1.VoucherTypeEnum.PURCHASE) {
                totalPurchase += totalAmount;
                totalInputGST += totalGST;
            }
            else if (voucherType === voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE) {
                totalCreditNote += totalAmount;
            }
            else if (voucherType === voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE) {
                totalDebitNote += totalAmount;
            }
        });
        const netSales = totalSales - totalCreditNote;
        const netPurchases = totalPurchase + totalDebitNote;
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
    async getTrialBalance(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            'ledger.group AS groupName',
            `SUM(CASE 
                    WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount 
                    ELSE 0 
                END) AS debitAmount`,
            `SUM(CASE 
                    WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount 
                    ELSE 0 
                END) AS creditAmount`
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
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
            .setParameters({
            debitVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
            creditVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE]
        })
            .getRawMany();
        console.log(ledgerTransactions, ">>>>>>>>");
        const trialBalance = {
            assets: [],
            liabilities: [],
            expenses: [],
            income: [],
            suspenseAccount: []
        };
        ledgerTransactions.forEach(({ groupName, ledgerName, debitAmount, creditAmount }) => {
            if ([
                groups_entity_1.UnderSecondary.CURRENT_ASSETS,
                groups_entity_1.UnderSecondary.LOANS_AND_ADVANCES,
                groups_entity_1.UnderSecondary.CASH_IN_HAND,
                groups_entity_1.UnderSecondary.BANK_ACCOUNTS,
                groups_entity_1.UnderSecondary.DEPOSITS,
                groups_entity_1.UnderSecondary.STOCK_IN_HAND,
                groups_entity_1.UnderSecondary.SUNDRY_DEBTORS,
                groups_entity_1.UnderSecondary.FIXED_ASSETS,
                groups_entity_1.UnderSecondary.INVESTMENTS,
                groups_entity_1.UnderSecondary.Miscellaneous_EXPENSES
            ].includes(groupName)) {
                trialBalance.assets.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
            else if ([
                groups_entity_1.UnderSecondary.CURRENT_LIABILITIES,
                groups_entity_1.UnderSecondary.DUTIES_AND_TAXES,
                groups_entity_1.UnderSecondary.PROVISIONS,
                groups_entity_1.UnderSecondary.SUNDRY_CREDITORS,
                groups_entity_1.UnderSecondary.BRANCH_DIVISION,
                groups_entity_1.UnderSecondary.CAPITAL_ACCOUNT,
                groups_entity_1.UnderSecondary.LOANS,
                groups_entity_1.UnderSecondary.BANK_OD,
                groups_entity_1.UnderSecondary.SECURED_LOANS,
                groups_entity_1.UnderSecondary.UNSECURED_LOANS,
                groups_entity_1.UnderSecondary.RESERVES_AND_SURPLUS
            ].includes(groupName)) {
                trialBalance.liabilities.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
            else if ([
                groups_entity_1.UnderSecondary.PURCHASE_ACCOUNT,
                groups_entity_1.UnderSecondary.Manufacturing_Expenses,
                groups_entity_1.UnderSecondary.INDIRECT_EXPENSES,
                groups_entity_1.UnderSecondary.DIRECT_EXPENSES
            ].includes(groupName)) {
                trialBalance.expenses.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
            else if ([
                groups_entity_1.UnderSecondary.SALES_ACCOUNT,
                groups_entity_1.UnderSecondary.RETAINED_EARNINGS,
                groups_entity_1.UnderSecondary.Rental_Income,
                groups_entity_1.UnderSecondary.Interest_Income,
                groups_entity_1.UnderSecondary.Commission_Received,
                groups_entity_1.UnderSecondary.DIRECT_INCOMES
            ].includes(groupName)) {
                trialBalance.income.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
            else if (groupName === groups_entity_1.UnderSecondary.SUSPENSE_ACCOUNT) {
                trialBalance.suspenseAccount.push({ ledgerName, debitAmount, creditAmount });
            }
        });
        console.log(trialBalance, "????????????????");
        return trialBalance;
    }
    async getBalanceSheet(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'SUM(CASE WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount ELSE 0 END) AS debitAmount',
            'SUM(CASE WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount ELSE 0 END) AS creditAmount'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.generation_date BETWEEN :fromDate AND :toDate', {
            fromDate: req.fromDate,
            toDate: req.toDate
        });
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }
        query.groupBy('ledger.group, ledger.name')
            .setParameters({
            debitVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
            creditVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE]
        });
        const ledgerTransactions = await query.getRawMany();
        const balanceSheet = {
            assets: [],
            liabilities: [],
            equity: []
        };
        ledgerTransactions.forEach(({ groupName, ledgerName, debitAmount, creditAmount }) => {
            const netAmount = debitAmount - creditAmount;
            if ([
                groups_entity_1.UnderSecondary.CURRENT_ASSETS,
                groups_entity_1.UnderSecondary.LOANS_AND_ADVANCES,
                groups_entity_1.UnderSecondary.CASH_IN_HAND,
                groups_entity_1.UnderSecondary.BANK_ACCOUNTS,
                groups_entity_1.UnderSecondary.DEPOSITS,
                groups_entity_1.UnderSecondary.STOCK_IN_HAND,
                groups_entity_1.UnderSecondary.SUNDRY_DEBTORS,
                groups_entity_1.UnderSecondary.FIXED_ASSETS,
                groups_entity_1.UnderSecondary.INVESTMENTS,
                groups_entity_1.UnderSecondary.Miscellaneous_EXPENSES
            ].includes(groupName)) {
                balanceSheet.assets.push({ groupName, ledgerName, amount: netAmount });
            }
            else if ([
                groups_entity_1.UnderSecondary.CURRENT_LIABILITIES,
                groups_entity_1.UnderSecondary.DUTIES_AND_TAXES,
                groups_entity_1.UnderSecondary.PROVISIONS,
                groups_entity_1.UnderSecondary.SUNDRY_CREDITORS,
                groups_entity_1.UnderSecondary.BRANCH_DIVISION,
                groups_entity_1.UnderSecondary.LOANS,
                groups_entity_1.UnderSecondary.BANK_OD,
                groups_entity_1.UnderSecondary.SECURED_LOANS,
                groups_entity_1.UnderSecondary.UNSECURED_LOANS
            ].includes(groupName)) {
                balanceSheet.liabilities.push({ groupName, ledgerName, amount: netAmount });
            }
            else if ([groups_entity_1.UnderSecondary.CAPITAL_ACCOUNT, groups_entity_1.UnderSecondary.RESERVES_AND_SURPLUS].includes(groupName)) {
                balanceSheet.equity.push({ groupName, ledgerName, amount: netAmount });
            }
        });
        const totalAssets = balanceSheet.assets.reduce((sum, item) => sum + item.amount, 0);
        const totalLiabilities = balanceSheet.liabilities.reduce((sum, item) => sum + item.amount, 0);
        const totalEquity = balanceSheet.equity.reduce((sum, item) => sum + item.amount, 0);
        return balanceSheet;
    }
    async getSalesReturns(req) {
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
            'MAX(sr.due_date) AS lastDueDate'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
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
            .addGroupBy('br.name');
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
    async getTDSReport(req) {
        const query = this.createQueryBuilder('sr')
            .select([
            'sr.invoice_id AS invoiceNumber',
            'sr.voucher_id AS voucherId',
            'sr.voucher_type AS voucherType',
            'SUM(sr.amount) AS totalAmount',
            'SUM(sr.tds) AS tdsPercentage',
            'sr.generation_date AS generationDate',
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'ledger.tds_deductable AS tdsDeductable',
            'br.name as branchName',
            'sr.payment_type as paymentType'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['Sales', 'PURCHASE'] })
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('sr.invoice_id')
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
    async getTCSReport(req) {
        const query = this.createQueryBuilder('sr')
            .select([
            'sr.invoice_id AS invoiceNumber',
            'sr.voucher_id AS voucherId',
            'sr.voucher_type AS voucherType',
            'SUM(sr.amount) AS totalAmount',
            'SUM(sr.tcs) AS tdsPercentage',
            'sr.generation_date AS generationDate',
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'ledger.tcs_deductable AS tcsDeductable',
            'br.name as branchName',
            'sr.payment_type as paymentType'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['Sales', 'PURCHASE'] })
            .andWhere('sr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sr.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('sr.invoice_id')
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
    async getDEBITNOTEReport(req) {
        const query = this.createQueryBuilder('sr')
            .select([
            'sr.voucher_id AS voucherId',
            'sr.voucher_type AS voucherType',
            'SUM(sr.amount) AS totalAmount',
            'sr.generation_date AS generationDate',
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'br.name as branchName',
            'sr.payment_type as paymentType'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['DEBITNOTE'] })
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
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');
        return await query.getRawMany();
    }
    async getCREDITNOTEReport(req) {
        const query = this.createQueryBuilder('sr')
            .select([
            'sr.voucher_id AS voucherId',
            'sr.voucher_type AS voucherType',
            'SUM(sr.amount) AS totalAmount',
            'sr.generation_date AS generationDate',
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'br.name as branchName',
            'sr.payment_type as paymentType'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['CREDITNOTE'] })
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
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');
        return await query.getRawMany();
    }
    async getJOURNALReport(req) {
        const query = this.createQueryBuilder('sr')
            .select([
            'sr.voucher_id AS voucherId',
            'sr.voucher_type AS voucherType',
            'SUM(sr.amount) AS totalAmount',
            'sr.generation_date AS generationDate',
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'br.name as branchName',
            'sr.payment_type as paymentType',
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['JOURNAL'] })
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
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');
        return await query.getRawMany();
    }
    async getPURCHASEReport(req) {
        const query = this.createQueryBuilder('sr')
            .select([
            'sr.voucher_id AS voucherId',
            'sr.voucher_type AS voucherType',
            'SUM(sr.amount) AS totalAmount',
            'sr.generation_date AS generationDate',
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'br.name as branchName',
            'sr.payment_type as paymentType',
            'MAX(ve.due_date) AS lastDueDate'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['PURCHASE'] })
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
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');
        return await query.getRawMany();
    }
    async getSALESReport(req) {
        const query = this.createQueryBuilder('sr')
            .select([
            'sr.voucher_id AS voucherId',
            'sr.voucher_type AS voucherType',
            'SUM(sr.amount) AS totalAmount',
            'sr.generation_date AS generationDate',
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'br.name as branchName',
            'sr.payment_type as paymentType',
            'MAX(ve.due_date) AS lastDueDate'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
            .where('sr.voucher_type IN (:...voucherTypes)', { voucherTypes: ['SALES'] })
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
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');
        return await query.getRawMany();
    }
    async getLedgerReport(req) {
        const query = this.createQueryBuilder('sr')
            .select([
            'sr.voucher_id AS voucherId',
            'sr.voucher_type AS voucherType',
            'SUM(sr.amount) AS totalAmount',
            'sr.generation_date AS generationDate',
            'ledger.group AS groupName',
            'ledger.name AS ledgerName',
            'br.name AS branchName',
            'sr.payment_type AS paymentType',
            'MAX(sr.due_date) AS lastDueDate'
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
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
        query.groupBy('sr.voucher_id')
            .addGroupBy('sr.voucher_type')
            .addGroupBy('sr.generation_date')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type');
        return await query.getRawMany();
    }
    async getPayableAmountForReport(req) {
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
                END AS "overdueDays"`
        ])
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.payment_status = :pendingStatus', { pendingStatus: payment_status_enum_1.PaymentStatus.PENDING })
            .andWhere('ve.voucher_type = :voucherType', { voucherType: voucher_type_enum_1.VoucherTypeEnum.PURCHASE });
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
            .addGroupBy('branch.name')
            .addGroupBy('ledger.name')
            .addGroupBy('ve.due_date')
            .orderBy('ve.generation_date', 'ASC')
            .addOrderBy('branch.name', 'ASC');
        return await query.getRawMany();
    }
    async generateIncomeStatement(req) {
        const netSales = await this.getTotalByVoucherType(voucher_type_enum_1.VoucherTypeEnum.SALES, req.year);
        const otherIncome = await this.getTotalByVoucherType(voucher_type_enum_1.VoucherTypeEnum.JOURNAL, req.year);
        const costOfSales = await this.getTotalByVoucherType(voucher_type_enum_1.VoucherTypeEnum.PURCHASE, req.year);
        const debitNotes = await this.getTotalByVoucherType(voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE, req.year);
        const creditNotes = await this.getTotalByVoucherType(voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE, req.year);
        const interestExpense = await this.getTotalByVoucherType(voucher_type_enum_1.VoucherTypeEnum.CONTRA, req.year);
        const grossProfit = netSales - costOfSales;
        const operatingExpenses = debitNotes;
        const incomeBeforeTaxes = grossProfit - operatingExpenses + creditNotes + otherIncome - interestExpense;
        const incomeTaxExpense = incomeBeforeTaxes * 0.30;
        const netIncome = incomeBeforeTaxes - incomeTaxExpense;
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
    async getTotalByVoucherType(voucherType, year) {
        const result = await this
            .createQueryBuilder('voucher')
            .select('SUM(voucher.amount)', 'total')
            .where('voucher.voucherType = :voucherType', { voucherType })
            .andWhere('YEAR(voucher.generation_date) = :year', { year })
            .getRawOne();
        return result?.total ?? 0;
    }
    async getCashFlow(req) {
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
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'sr.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'sr.branch_id = br.id')
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
        query.groupBy('sr.voucher_type')
            .addGroupBy('ledger.group')
            .addGroupBy('ledger.name')
            .addGroupBy('br.name')
            .addGroupBy('sr.payment_type')
            .addGroupBy('sr.generation_date');
        const results = await query.getRawMany();
        let cashInflow = 0;
        let cashOutflow = 0;
        results.forEach((txn) => {
            const amount = parseFloat(txn.totalAmount) || 0;
            if ([voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE].includes(txn.voucherType)) {
                cashInflow += amount;
            }
            else if ([voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE].includes(txn.voucherType)) {
                cashOutflow += amount;
            }
        });
        const netCashFlow = cashInflow - cashOutflow;
        return { cashInflow, cashOutflow, netCashFlow, transactions: results };
    }
    async getBankReconciliationReport(req) {
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
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'txn.ledger_id = ledger.id')
            .leftJoin(account_entity_1.AccountEntity, 'bank', 'txn.from_account_id = bank.id')
            .where('txn.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('txn.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('txn.payment_type = :paymentType', { paymentType: payment_type_enum_1.PaymentType.BANK });
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
        let bankBalance = 0;
        let totalReceipts = 0;
        let totalPayments = 0;
        let depositsInTransit = 0;
        let outstandingChecks = 0;
        let bankCharges = 0;
        transactions.forEach((txn) => {
            if ([voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE].includes(txn.voucherType)) {
                totalReceipts += txn.amount;
                if (txn.transactionStatus === 'PENDING' && voucher_type_enum_1.VoucherTypeEnum.SALES) {
                    depositsInTransit += txn.amount;
                }
            }
            else if ([voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE].includes(txn.voucherType)) {
                totalPayments += txn.amount;
                if (txn.transactionStatus === 'PENDING' && voucher_type_enum_1.VoucherTypeEnum.PURCHASE) {
                    outstandingChecks += txn.amount;
                }
            }
            else if (txn.voucherType === voucher_type_enum_1.VoucherTypeEnum.CONTRA && txn.paymentType === payment_type_enum_1.PaymentType.BANK) {
                bankCharges += txn.amount;
            }
        });
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
    async getBankStmtForReport(req) {
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
            .leftJoin(account_entity_1.AccountEntity, 'fromBank', 've.from_account_id = fromBank.id')
            .leftJoin(account_entity_1.AccountEntity, 'toBank', 've.to_account_id = toBank.id')
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'ledger.id = ve.ledger_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.payment_type != :paymentType', { paymentType: payment_type_enum_1.PaymentType.CASH });
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
            debitVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
            creditVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE]
        })
            .orderBy('ve.generation_date', 'ASC')
            .addOrderBy('branch.name', 'ASC');
        return await query.getRawMany();
    }
    async getCashStmtForReport(req) {
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
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 'ledger.id = ve.ledger_id')
            .where('ve.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('ve.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('ve.payment_type = :paymentType', { paymentType: payment_type_enum_1.PaymentType.CASH });
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
    async getLoansAndInterestsForReport(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            'ledger.group AS "groupName"',
            'ledger.name AS "ledgerName"',
            `COALESCE(SUM(CASE 
                    WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount 
                    ELSE 0 
                END), 0) AS "debitAmount"`,
            `COALESCE(SUM(CASE 
                    WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount 
                    ELSE 0 
                END), 0) AS "creditAmount"`
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
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
            .addGroupBy('ledger.name')
            .setParameters({
            debitVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
            creditVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE]
        })
            .getRawMany();
        console.log(ledgerTransactions, ">>>>>>>>");
        const loansandinterstAmounts = {
            loans: [],
            interest: [],
        };
        ledgerTransactions.forEach(({ groupName, ledgerName, debitAmount, creditAmount }) => {
            if ([
                groups_entity_1.UnderSecondary.LOANS,
                groups_entity_1.UnderSecondary.LOANS_AND_ADVANCES,
                groups_entity_1.UnderSecondary.CASH_IN_HAND,
                groups_entity_1.UnderSecondary.SECURED_LOANS,
                groups_entity_1.UnderSecondary.UNSECURED_LOANS,
            ].includes(groupName)) {
                loansandinterstAmounts.loans.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
            else if ([groups_entity_1.UnderSecondary.Interest_Income].includes(groupName)) {
                loansandinterstAmounts.interest.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
        });
        return loansandinterstAmounts;
    }
    async getFixedAssertsForReport(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            'ledger.group AS "groupName"',
            'ledger.name AS "ledgerName"',
            `COALESCE(SUM(CASE 
                    WHEN ve.voucher_type IN (:...debitVouchers) THEN ve.amount 
                    ELSE 0 
                END), 0) AS "debitAmount"`,
            `COALESCE(SUM(CASE 
                    WHEN ve.voucher_type IN (:...creditVouchers) THEN ve.amount 
                    ELSE 0 
                END), 0) AS "creditAmount"`
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
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
            .addGroupBy('ledger.name')
            .setParameters({
            debitVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE],
            creditVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.DEBITNOTE]
        })
            .getRawMany();
        console.log(ledgerTransactions, ">>>>>>>>");
        const loansandinterstAmounts = {
            asserts: [],
        };
        ledgerTransactions.forEach(({ groupName, ledgerName, debitAmount, creditAmount }) => {
            if ([
                groups_entity_1.UnderSecondary.FIXED_ASSETS
            ].includes(groupName)) {
                loansandinterstAmounts.asserts.push({ ledgerName, groupName, debitAmount, creditAmount });
            }
        });
        return loansandinterstAmounts;
    }
    async getProfitAndLoss(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            'ledger.group AS "groupName"',
            'ledger.name AS "ledgerName"',
            `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:purchaseVouchers) THEN ve.amount ELSE 0 END), 0) AS "purchaseAmount"`,
            `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:salesVouchers) THEN ve.amount ELSE 0 END), 0) AS "salesAmount"`,
            `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:indirectExpenseVouchers) THEN ve.amount ELSE 0 END), 0) AS "indirectExpenseAmount"`,
            `COALESCE(SUM(CASE WHEN ve.voucher_type IN (:indirectIncomeVouchers) THEN ve.amount ELSE 0 END), 0) AS "indirectIncomeAmount"`
        ])
            .leftJoin(ledger_entity_1.LedgerEntity, 'ledger', 've.ledger_id = ledger.id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = ve.branch_id')
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
            purchaseVouchers: [voucher_type_enum_1.VoucherTypeEnum.PAYMENT],
            salesVouchers: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT],
            indirectExpenseVouchers: [voucher_type_enum_1.VoucherTypeEnum.JOURNAL],
            indirectIncomeVouchers: [voucher_type_enum_1.VoucherTypeEnum.CREDITNOTE]
        })
            .getRawMany();
        return {
            purchases: profitAndLoss.filter(p => p.purchaseAmount > 0),
            sales: profitAndLoss.filter(p => p.salesAmount > 0),
            indirectExpenses: profitAndLoss.filter(p => p.indirectExpenseAmount > 0),
            indirectIncomes: profitAndLoss.filter(p => p.indirectIncomeAmount > 0)
        };
    }
};
exports.VoucherRepository = VoucherRepository;
exports.VoucherRepository = VoucherRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], VoucherRepository);
//# sourceMappingURL=voucher.repo.js.map