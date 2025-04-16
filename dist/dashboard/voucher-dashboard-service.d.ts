import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { BranchChartDto } from "src/voucher/dto/balance-chart.dto";
import { InvoiceDto } from "src/voucher/dto/invoice.dto";
import { VoucherIDResDTo } from "src/voucher/dto/voucher-id.res.dto";
import { VoucherRepository } from "src/voucher/repo/voucher.repo";
export declare class VoucherDashboardService {
    private voucherRepository;
    constructor(voucherRepository: VoucherRepository);
    getVoucherData(req: InvoiceDto): Promise<CommonResponse>;
    getExpansesTableData(req: InvoiceDto): Promise<CommonResponse>;
    getDetailInVoiceData(req: VoucherIDResDTo): Promise<CommonResponse>;
    getReceiptData(req: {
        voucherId?: string;
        clientName?: string;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getPaymentData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<CommonResponse>;
    getProductsPhotos(req: {
        subDealerId?: string;
        vendorId?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse>;
    getTrialBalance(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getBalanceSheet(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getSalesReturns(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getTDSReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getTCSReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getDEBITNOTEReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getCREDITNOTEReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getJOURNALReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getPURCHASEReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getSALESReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getLedgerReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getPayableAmountForReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getProfitAndLoss(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getFixedAssertsForReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getLoansAndInterestsForReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getCashStmtForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getBankStmtForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        bankAccountNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getBankReconciliationReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        bankAccount?: string;
    }): Promise<CommonResponse>;
    getCashFlow(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    generateIncomeStatement(req: {
        year?: number;
    }): Promise<CommonResponse>;
    getTotalSalesForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getSalesForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getPayableAmountForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getReceivableAmountForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getAllPaymentsVouchers(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getPurchaseDataForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getAmountDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getVoucherAmountDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    calculateGstReturns(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
    }): Promise<CommonResponse>;
    getPurchaseData(req: CommonReq): Promise<CommonResponse>;
    getTotalProductAndServiceSales(req: CommonReq): Promise<CommonResponse>;
    getAllVouchers(req: {
        voucherId?: number;
        branchName?: string;
        paymentStatus?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getDayBookDataForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getClientPurchaseOrderDataTable(req: {
        phoneNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getReceiptDataForReport(req: {
        voucherId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getMonthWiseBalance(req: BranchChartDto): Promise<CommonResponse>;
    getYearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    get4YearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    getDayBookData(req: BranchChartDto): Promise<CommonResponse>;
    getPurchaseCount(req: CommonReq): Promise<CommonResponse>;
    getLast30DaysCreditAndDebitPercentages(req: {
        companyCode: string;
        unitCode: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getProductTypeCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    getBranchWiseYearlySales(req: BranchChartDto): Promise<CommonResponse>;
    getSalesBreakdown(req: BranchChartDto): Promise<CommonResponse>;
    getBranchWiseMonthlySales(req: BranchChartDto): Promise<CommonResponse>;
    getOverAllYearlySales(req: BranchChartDto): Promise<CommonResponse>;
    get4ProductTypeCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    getPurchaseOrderDataTable(req: CommonReq): Promise<CommonResponse>;
    getPaymentDataTable(req: {
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<CommonResponse>;
    getSolidLiquidCash(req: CommonReq): Promise<CommonResponse>;
    getBranchWiseSolidLiquidCash(req: CommonReq): Promise<CommonResponse>;
    getBranchWiseAccountAmounts(req: CommonReq): Promise<CommonResponse>;
    getTotalPayableAndReceivablePercentage(req: BranchChartDto): Promise<CommonResponse>;
}
