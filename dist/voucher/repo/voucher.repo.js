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
const typeorm_1 = require("typeorm");
const voucher_entity_1 = require("../entity/voucher.entity");
const voucher_type_enum_1 = require("../enum/voucher-type-enum");
const product_type_enum_1 = require("../../product/dto/product-type.enum");
let VoucherRepository = class VoucherRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(voucher_entity_1.VoucherEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getInVoiceData(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            've.voucher_id AS InVoiceId',
            've.name AS name',
            'cl.name AS clientName',
            've.generation_date AS generationDate',
            've.expire_date AS expireDate',
            've.payment_status AS paymentStatus',
            've.amount AS amount',
        ])
            .leftJoin('client', 'cl', 'cl.voucher_id = ve.id')
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.INVOICE })
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
            .where('ve.voucher_id = :voucherId', { voucherId: req.voucherId })
            .andWhere('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.INVOICE })
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
            .getRawOne();
        return query;
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
            .leftJoin('ve.branchId', 'branch')
            .leftJoin('ve.client', 'cl')
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
            've.payment_to AS paymentTo',
            've.payment_status AS paymentStatus',
            've.amount AS amount',
        ])
            .leftJoin('ve.client', 'cl')
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
            .leftJoin('ve.branchId', 'br')
            .leftJoin('ve.vendor', 'vn')
            .leftJoin('ve.client', 'cl')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.PURCHASE })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .getRawMany();
        return query;
    }
    async getLedgerData(req) {
        const query = this.createQueryBuilder('ve')
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
            .where('ve.voucher_type IN (:...types)', { types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE] })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
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
            .addGroupBy('ve.amount');
        const result = await query.getRawMany();
        return result;
    }
    async getDetailLedgerData(req) {
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
            .andWhere('ve.voucher_type IN (:...types)', { types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE] })
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
            .addGroupBy('ve.debit_amount')
            .addGroupBy('ve.credit_amount')
            .addGroupBy('ve.purpose')
            .getRawOne();
        return query;
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
            'branch.name AS branchName',
            'SUM(ve.credit_amount) - SUM(ve.debit_amount) AS balanceAmount',
            've.voucher_type AS voucherType',
        ])
            .leftJoin('ve.branchId', 'branch')
            .leftJoin('ve.client', 'cl')
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
            .addGroupBy('ve.voucher_type');
        const result = await query.getRawMany();
        return result;
    }
    async getMonthWiseBalance(req) {
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
            .where('ve.voucher_type IN (:...types)', { types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE] })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .groupBy('YEAR(ve.generation_date), MONTH(ve.generation_date), MONTHNAME(ve.generation_date)');
        const result = await query.getRawMany();
        return result;
    }
    async getYearWiseCreditAndDebitPercentages(req) {
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
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE]
        })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .groupBy('YEAR(ve.generation_date), ve.product_type')
            .orderBy('YEAR(ve.generation_date), ve.product_type')
            .getRawMany();
        return query;
    }
    async getDayBookData(req) {
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
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE],
        })
            .andWhere(`YEAR(ve.generation_date) = :year`, { year: req.date.split('-')[0] })
            .andWhere(`MONTH(ve.generation_date) = :month`, { month: req.date.split('-')[1] })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .groupBy(`YEAR(ve.generation_date), 
                MONTH(ve.generation_date), 
                ve.product_type, 
                DATE(ve.generation_date), 
                ve.voucher_id, 
                ve.voucher_type, 
                ve.purpose`)
            .orderBy('YEAR(ve.generation_date)', 'ASC')
            .addOrderBy('MONTH(ve.generation_date)', 'ASC')
            .addOrderBy('ve.product_type', 'ASC')
            .getRawMany();
        return query;
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
    async getExpenseData(req) {
        const query = this.createQueryBuilder('ve')
            .select('SUM(ve.amount) AS totalExpenses')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.PURCHASE })
            .andWhere('ve.product_type = :productType', { productType: product_type_enum_1.ProductType.expanses })
            .andWhere('DATE(ve.generationDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
        const last30DaysResult = await query.getRawOne();
        const weekQuery = this.createQueryBuilder('ve')
            .select('SUM(ve.amount) AS totalExpenses')
            .where('ve.voucher_type = :type', { type: voucher_type_enum_1.VoucherTypeEnum.PURCHASE })
            .andWhere('ve.product_type = :productType', { productType: product_type_enum_1.ProductType.expanses })
            .andWhere('DATE(ve.generationDate) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
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
    async getLast30DaysCreditAndDebitPercentages(req) {
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
            .leftJoin('branches', 'branch', 'branch.id = ve.branch_id')
            .where('ve.voucher_type IN (:...types)', {
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.PAYMENT, voucher_type_enum_1.VoucherTypeEnum.PURCHASE]
        })
            .andWhere('ve.generation_date >= CURDATE() - INTERVAL 30 DAY')
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .groupBy(`DATE(ve.generation_date), 
                ve.product_type, 
                branch.name, 
                branch.manager_name, 
                branch.branch_number, 
                branch.branch_address`)
            .orderBy(`DATE(ve.generation_date)`, 'ASC')
            .addOrderBy('ve.product_type', 'ASC')
            .addOrderBy('branch.name', 'ASC')
            .addOrderBy('branch.branch_number', 'ASC')
            .getRawMany();
        return query;
    }
    async getSolidLiquidCash(req) {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const result = await this.dataSource
            .getRepository(voucher_entity_1.VoucherEntity)
            .createQueryBuilder('ve')
            .select([
            `SUM(CASE 
              WHEN ve.voucher_type = :receiptType 
                AND ve.product_type IN ('service', 'product', 'sales') 
              THEN ve.amount 
              ELSE 0 
            END) AS solidCash`,
            `SUM(CASE 
              WHEN ve.voucher_type = :contraType 
                AND ve.bank_from IS NOT NULL 
                AND ve.bank_to IS NULL 
              THEN ve.amount 
              ELSE 0 
            END) AS solidCashFromContra`,
            `SUM(CASE 
              WHEN ve.voucher_type = :contraType 
                AND ve.bank_from IS NOT NULL 
                AND ve.bank_to IS NOT NULL 
              THEN ve.amount 
              ELSE 0 
            END) AS liquidCash`,
        ])
            .where('ve.generation_date >= :last30Days', { last30Days })
            .andWhere('ve.voucher_type IN (:...types)', {
            types: [voucher_type_enum_1.VoucherTypeEnum.RECEIPT, voucher_type_enum_1.VoucherTypeEnum.CONTRA],
        })
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .setParameters({
            receiptType: voucher_type_enum_1.VoucherTypeEnum.RECEIPT,
            contraType: voucher_type_enum_1.VoucherTypeEnum.CONTRA,
        })
            .getRawOne();
        return {
            solidCash: parseFloat(result.solidCash) + parseFloat(result.solidCashFromContra),
            liquidCash: parseFloat(result.liquidCash),
        };
    }
};
exports.VoucherRepository = VoucherRepository;
exports.VoucherRepository = VoucherRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], VoucherRepository);
//# sourceMappingURL=voucher.repo.js.map