import { CommonReq } from "src/models/common-req";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { DataSource, Repository } from "typeorm";
import { BranchChartDto } from "../dto/balance-chart.dto";
import { InvoiceDto } from "../dto/invoice.dto";
import { VoucherIDResDTo } from "../dto/voucher-id.res.dto";
import { VoucherEntity } from "../entity/voucher.entity";
export declare class VoucherRepository extends Repository<VoucherEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getInVoiceData(req: InvoiceDto): Promise<any[]>;
    getDetailInVoiceData(req: VoucherIDResDTo): Promise<any>;
    getReceiptDataForReport(filters: {
        voucherId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getReceiptData(filters: {
        voucherId?: string;
        clientName?: string;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getPaymentData(filters: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<any[]>;
    getPurchaseData(req: CommonReq): Promise<any[]>;
    getClientPurchaseOrderDataTable(req: {
        phoneNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getAllVouchers(req: {
        voucherId?: number;
        branchName?: string;
        paymentStatus?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getMonthWiseBalance(req: BranchChartDto): Promise<{
        branchName: string;
        data: any;
    }[]>;
    getYearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<any>;
    get4YearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<any>;
    getTotalProductAndServiceSales(req: CommonReq): Promise<any[]>;
    getTotalSalesForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getDayBookData(req: BranchChartDto): Promise<any[]>;
    getDayBookDataForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getPurchaseCount(req: CommonReq): Promise<any>;
    getExpansesTableData(req: InvoiceDto): Promise<any[]>;
    getLast30DaysCreditAndDebitPercentages(req: {
        companyCode: string;
        unitCode: string;
        branchName?: string;
    }): Promise<any[]>;
    getProductsPhotos(req: {
        subDealerId?: string;
        vendorId?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<{
        productName: any;
        productPhoto: any;
    }[]>;
    getProductTypeCreditAndDebitPercentages(req: BranchChartDto): Promise<any>;
    get4ProductTypeCreditAndDebitPercentages(req: BranchChartDto): Promise<any>;
    getPurchaseOrderDataTable(req: {
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<any[]>;
    getPaymentDataTable(req: {
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<any[]>;
    getBranchWiseYearlySales(req: BranchChartDto): Promise<any>;
    getBranchWiseMonthlySales(req: BranchChartDto): Promise<any>;
    getOverAllYearlySales(req: BranchChartDto): Promise<any>;
    getTotalPayableAndReceivablePercentage(req: BranchChartDto): Promise<any[]>;
    getSalesBreakdown(req: BranchChartDto): Promise<any[]>;
    getSalesForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getPayableAmountForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getReceivableAmountForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getAllPaymentsVouchers(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getPurchaseDataForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getAmountDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any>;
    getVoucherAmountDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any>;
    getSolidLiquidCash(req: CommonReq): Promise<{
        solidCash: number;
        liquidCash: number;
    }>;
    getBranchWiseSolidLiquidCash(req: CommonReq): Promise<{
        branchName: string;
        solidCash: number;
        liquidCash: number;
    }[]>;
    getBranchWiseAccountAmounts(req: CommonReq): Promise<{
        [x: string]: Record<string, number>;
    }[]>;
    calculateGstReturns(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
    }): Promise<{
        GSTR1: {
            totalSales: number;
            totalCreditNote: number;
            totalDebitNote: number;
            netTaxableSales: number;
            outputGST: number;
        };
        GSTR3B: {
            totalPurchase: number;
            totalCreditNote: number;
            totalDebitNote: number;
            netPurchases: number;
            inputGST: number;
            gstPayable: number;
        };
    }>;
    getTrialBalance(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<{
        assets: any[];
        liabilities: any[];
        expenses: any[];
        income: any[];
        suspenseAccount: any[];
    }>;
    getBalanceSheet(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<{
        assets: any[];
        liabilities: any[];
        equity: any[];
    }>;
    getSalesReturns(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getTDSReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getTCSReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getDEBITNOTEReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getCREDITNOTEReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getJOURNALReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getPURCHASEReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getSALESReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getLedgerReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<any[]>;
    getPayableAmountForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    generateIncomeStatement(req: {
        year?: number;
    }): Promise<{
        netSales: number;
        costOfSales: number;
        grossProfit: number;
        operatingExpenses: number;
        interestExpense: number;
        otherIncome: number;
        incomeBeforeTaxes: number;
        incomeTaxExpense: number;
        netIncome: number;
    }>;
    private getTotalByVoucherType;
    getCashFlow(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<{
        cashInflow: number;
        cashOutflow: number;
        netCashFlow: number;
        transactions: any[];
    }>;
    getBankReconciliationReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        bankAccount?: string;
    }): Promise<{
        bankBalance: number;
        totalReceipts: number;
        totalPayments: number;
        depositsInTransit: number;
        outstandingChecks: number;
        bankCharges: number;
        transactions: any[];
    }>;
    getBankStmtForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        bankAccountNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getCashStmtForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getLoansAndInterestsForReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<{
        loans: any[];
        interest: any[];
    }>;
    getFixedAssertsForReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<{
        asserts: any[];
    }>;
    getProfitAndLoss(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<{
        purchases: any[];
        sales: any[];
        indirectExpenses: any[];
        indirectIncomes: any[];
    }>;
}
