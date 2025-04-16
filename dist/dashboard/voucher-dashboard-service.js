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
exports.VoucherDashboardService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const voucher_repo_1 = require("../voucher/repo/voucher.repo");
let VoucherDashboardService = class VoucherDashboardService {
    constructor(voucherRepository) {
        this.voucherRepository = voucherRepository;
    }
    async getVoucherData(req) {
        const VoucherData = await this.voucherRepository.getInVoiceData(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getExpansesTableData(req) {
        const VoucherData = await this.voucherRepository.getExpansesTableData(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getDetailInVoiceData(req) {
        const VoucherData = await this.voucherRepository.getDetailInVoiceData(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getReceiptData(req) {
        const VoucherData = await this.voucherRepository.getReceiptData(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getPaymentData(req) {
        const VoucherData = await this.voucherRepository.getPaymentData(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getProductsPhotos(req) {
        const VoucherData = await this.voucherRepository.getProductsPhotos(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getTrialBalance(req) {
        const VoucherData = await this.voucherRepository.getTrialBalance(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getBalanceSheet(req) {
        const VoucherData = await this.voucherRepository.getBalanceSheet(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getSalesReturns(req) {
        const VoucherData = await this.voucherRepository.getSalesReturns(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getTDSReport(req) {
        const VoucherData = await this.voucherRepository.getTDSReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getTCSReport(req) {
        const VoucherData = await this.voucherRepository.getTCSReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getDEBITNOTEReport(req) {
        const VoucherData = await this.voucherRepository.getDEBITNOTEReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getCREDITNOTEReport(req) {
        const VoucherData = await this.voucherRepository.getCREDITNOTEReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getJOURNALReport(req) {
        const VoucherData = await this.voucherRepository.getJOURNALReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getPURCHASEReport(req) {
        const VoucherData = await this.voucherRepository.getPURCHASEReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getSALESReport(req) {
        const VoucherData = await this.voucherRepository.getSALESReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getLedgerReport(req) {
        const VoucherData = await this.voucherRepository.getLedgerReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getPayableAmountForReport(req) {
        const VoucherData = await this.voucherRepository.getPayableAmountForReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getProfitAndLoss(req) {
        const VoucherData = await this.voucherRepository.getProfitAndLoss(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getFixedAssertsForReport(req) {
        const VoucherData = await this.voucherRepository.getFixedAssertsForReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getLoansAndInterestsForReport(req) {
        const VoucherData = await this.voucherRepository.getLoansAndInterestsForReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getCashStmtForReport(req) {
        const VoucherData = await this.voucherRepository.getCashStmtForReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getBankStmtForReport(req) {
        const VoucherData = await this.voucherRepository.getBankStmtForReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getBankReconciliationReport(req) {
        const VoucherData = await this.voucherRepository.getBankReconciliationReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getCashFlow(req) {
        const VoucherData = await this.voucherRepository.getCashFlow(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async generateIncomeStatement(req) {
        const VoucherData = await this.voucherRepository.generateIncomeStatement(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getTotalSalesForReport(req) {
        try {
            const data = [];
            const voucherData = await this.voucherRepository.getTotalSalesForReport(req);
            for (const item of voucherData) {
                const obj = {
                    date: item.date,
                    branchName: item.branchName,
                    serviceSales: item.serviceSales,
                };
                data.push(obj);
            }
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', data);
        }
        catch (err) {
            console.error('Error in getTotalSalesForReport:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getSalesForTable(req) {
        try {
            const voucherData = await this.voucherRepository.getSalesForTable(req);
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', voucherData);
        }
        catch (err) {
            console.error('Error in getSalesForTable:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getPayableAmountForTable(req) {
        try {
            const voucherData = await this.voucherRepository.getPayableAmountForTable(req);
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', voucherData);
        }
        catch (err) {
            console.error('Error in getSalesForTable:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getReceivableAmountForTable(req) {
        try {
            const voucherData = await this.voucherRepository.getReceivableAmountForTable(req);
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', voucherData);
        }
        catch (err) {
            console.error('Error in getSalesForTable:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getAllPaymentsVouchers(req) {
        try {
            const voucherData = await this.voucherRepository.getAllPaymentsVouchers(req);
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', voucherData);
        }
        catch (err) {
            console.error('Error in getSalesForTable:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getPurchaseDataForTable(req) {
        try {
            const voucherData = await this.voucherRepository.getPurchaseDataForTable(req);
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', voucherData);
        }
        catch (err) {
            console.error('Error in getSalesForTable:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getAmountDetails(req) {
        try {
            const voucherData = await this.voucherRepository.getAmountDetails(req);
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', voucherData);
        }
        catch (err) {
            console.error('Error in getSalesForTable:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getVoucherAmountDetails(req) {
        try {
            const voucherData = await this.voucherRepository.getVoucherAmountDetails(req);
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', voucherData);
        }
        catch (err) {
            console.error('Error in getSalesForTable:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async calculateGstReturns(req) {
        try {
            const voucherData = await this.voucherRepository.calculateGstReturns(req);
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', voucherData);
        }
        catch (err) {
            console.error('Error in getSalesForTable:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getPurchaseData(req) {
        const VoucherData = await this.voucherRepository.getPurchaseData(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getTotalProductAndServiceSales(req) {
        const VoucherData = await this.voucherRepository.getTotalProductAndServiceSales(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getAllVouchers(req) {
        const VoucherData = await this.voucherRepository.getAllVouchers(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getDayBookDataForReport(req) {
        try {
            const data = [];
            const VoucherData = await this.voucherRepository.getDayBookDataForReport(req);
            for (const row of VoucherData) {
                const obj = {
                    date: row.date,
                    voucherId: row.voucherId,
                    productType: row.productType,
                    voucherType: row.voucherType,
                    purpose: row.purpose,
                    creditAmount: row.creditAmount,
                    debitAmount: row.debitAmount,
                    balanceAmount: row.balanceAmount,
                };
                data.push(obj);
            }
            return new common_response_1.CommonResponse(true, 200, 'Data retrieved successfully', data);
        }
        catch (err) {
            console.error('Error in getTotalSalesForReport:', err);
            return new common_response_1.CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }
    async getClientPurchaseOrderDataTable(req) {
        const VoucherData = await this.voucherRepository.getClientPurchaseOrderDataTable(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getReceiptDataForReport(req) {
        const VoucherData = await this.voucherRepository.getReceiptDataForReport(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getMonthWiseBalance(req) {
        const VoucherData = await this.voucherRepository.getMonthWiseBalance(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getYearWiseCreditAndDebitPercentages(req) {
        const VoucherData = await this.voucherRepository.getYearWiseCreditAndDebitPercentages(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async get4YearWiseCreditAndDebitPercentages(req) {
        const VoucherData = await this.voucherRepository.get4YearWiseCreditAndDebitPercentages(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getDayBookData(req) {
        const VoucherData = await this.voucherRepository.getDayBookData(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getPurchaseCount(req) {
        const VoucherData = await this.voucherRepository.getPurchaseCount(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getLast30DaysCreditAndDebitPercentages(req) {
        const VoucherData = await this.voucherRepository.getLast30DaysCreditAndDebitPercentages(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getProductTypeCreditAndDebitPercentages(req) {
        const VoucherData = await this.voucherRepository.getProductTypeCreditAndDebitPercentages(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getBranchWiseYearlySales(req) {
        const VoucherData = await this.voucherRepository.getBranchWiseYearlySales(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getSalesBreakdown(req) {
        const VoucherData = await this.voucherRepository.getSalesBreakdown(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getBranchWiseMonthlySales(req) {
        const VoucherData = await this.voucherRepository.getBranchWiseMonthlySales(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getOverAllYearlySales(req) {
        const VoucherData = await this.voucherRepository.getOverAllYearlySales(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async get4ProductTypeCreditAndDebitPercentages(req) {
        const VoucherData = await this.voucherRepository.get4ProductTypeCreditAndDebitPercentages(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getPurchaseOrderDataTable(req) {
        const VoucherData = await this.voucherRepository.getPurchaseOrderDataTable(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getPaymentDataTable(req) {
        const VoucherData = await this.voucherRepository.getPaymentDataTable(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getSolidLiquidCash(req) {
        const VoucherData = await this.voucherRepository.getSolidLiquidCash(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getBranchWiseSolidLiquidCash(req) {
        const VoucherData = await this.voucherRepository.getBranchWiseSolidLiquidCash(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getBranchWiseAccountAmounts(req) {
        const VoucherData = await this.voucherRepository.getBranchWiseAccountAmounts(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getTotalPayableAndReceivablePercentage(req) {
        const VoucherData = await this.voucherRepository.getTotalPayableAndReceivablePercentage(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
};
exports.VoucherDashboardService = VoucherDashboardService;
exports.VoucherDashboardService = VoucherDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [voucher_repo_1.VoucherRepository])
], VoucherDashboardService);
//# sourceMappingURL=voucher-dashboard-service.js.map