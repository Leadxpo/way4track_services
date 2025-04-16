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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const assert_dashboard_service_1 = require("./assert-dashboard.service");
const staff_dashboard_service_1 = require("./staff-dashboard.service");
const staff_date_dto_1 = require("../staff/dto/staff-date.dto");
const product_assign_dashboard_service_1 = require("./product-assign-dashboard.service");
const client_dashboards_service_1 = require("./client-dashboards.service");
const vendor_dashboard_service_1 = require("./vendor-dashboard.service");
const sub_dealer_dashboard_service_1 = require("./sub-dealer-dashboard-service");
const appointment_dashboard_service_1 = require("./appointment-dashboard.service");
const tickets_dashboard_service_1 = require("./tickets-dashboard.service");
const voucher_dashboard_service_1 = require("./voucher-dashboard-service");
const balance_chart_dto_1 = require("../voucher/dto/balance-chart.dto");
const vendor_id_deatil_1 = require("../vendor/dto/vendor-id.deatil");
const detail_sub_dealer_dto_1 = require("../sub-dealer/dto/detail-sub-dealer.dto");
const detail_client_dto_1 = require("../client/dto/detail.client.dto");
const voucher_id_res_dto_1 = require("../voucher/dto/voucher-id.res.dto");
const invoice_dto_1 = require("../voucher/dto/invoice.dto");
const staff_search_dto_1 = require("../staff/dto/staff-search.dto");
const ticket_search_dto_1 = require("../tickets/dto/ticket-search.dto");
const estimate_dashboard_service_1 = require("./estimate-dashboard.service");
const common_req_1 = require("../models/common-req");
const account_dashboard_service_1 = require("./account.dashboard.service");
const client_search_dto_1 = require("../client/dto/client-search.dto");
const estimate_send_dto_1 = require("../estimate/dto/estimate.send.dto");
const product_id_dto_1 = require("../product/dto/product.id.dto");
let DashboardController = class DashboardController {
    constructor(assertService, staffDashboardService, productAssignDashboardService, clientDashboardService, vendorDashboardService, subDealerDashboardService, appointmentDashboardService, ticketsDashboardService, voucherDashboardService, estimateDashboardService, accountDashboardService) {
        this.assertService = assertService;
        this.staffDashboardService = staffDashboardService;
        this.productAssignDashboardService = productAssignDashboardService;
        this.clientDashboardService = clientDashboardService;
        this.vendorDashboardService = vendorDashboardService;
        this.subDealerDashboardService = subDealerDashboardService;
        this.appointmentDashboardService = appointmentDashboardService;
        this.ticketsDashboardService = ticketsDashboardService;
        this.voucherDashboardService = voucherDashboardService;
        this.estimateDashboardService = estimateDashboardService;
        this.accountDashboardService = accountDashboardService;
    }
    async sendReciept(dto) {
        try {
            return await this.estimateDashboardService.sendReceipt(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async sendInvoice(dto) {
        try {
            return await this.estimateDashboardService.sendInvoice(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async sendReceipt(dto) {
        try {
            return await this.estimateDashboardService.sendReceipt(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async sendEstimate(dto) {
        try {
            return await this.estimateDashboardService.sendEstimate(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async assertsCardData(req) {
        try {
            return await this.assertService.assertsCardData(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async getAssertDataByDate(req) {
        try {
            return await this.assertService.getAssertDataByDate(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async staffAttendanceDetails(req) {
        try {
            return await this.staffDashboardService.staffAttendanceDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getStaffSearchDetails(req) {
        try {
            return await this.staffDashboardService.getStaffSearchDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getStaff(req) {
        try {
            return await this.staffDashboardService.getStaff(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getStaffCardsDetails(req) {
        try {
            return await this.staffDashboardService.getStaffCardsDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getTotalStaffDetails(req) {
        try {
            return await this.staffDashboardService.getTotalStaffDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getBranchStaffDetails(req) {
        try {
            return await this.staffDashboardService.getBranchStaffDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getAllBranchStaffDetails(req) {
        try {
            return await this.staffDashboardService.getAllBranchStaffDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async payRoll(req) {
        try {
            return await this.staffDashboardService.payRoll(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async productAssignDetails(req) {
        try {
            return await this.productAssignDashboardService.productAssignDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProductAssignmentSummaryBySubDealer(req) {
        try {
            return await this.productAssignDashboardService.getProductAssignmentSummaryBySubDealer(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async productSubDealerAssignDetails(req) {
        try {
            return await this.productAssignDashboardService.productSubDealerAssignDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProductDetailsBySubDealer(req) {
        try {
            return await this.productAssignDashboardService.getProductDetailsBySubDealer(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getSearchDetailProductAssign(req) {
        try {
            return await this.productAssignDashboardService.getSearchDetailProduct(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getStockSummary(req) {
        try {
            return await this.productAssignDashboardService.getStockSummary(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getTicketDetailsAgainstSearch(req) {
        try {
            return await this.ticketsDashboardService.getTicketDetailsAgainstSearch(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getEstimates(req) {
        try {
            return await this.estimateDashboardService.getEstimates(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getEstimatesForReport(req) {
        try {
            return await this.estimateDashboardService.getEstimatesForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getTotalAssignedAndStockLast30Days(req) {
        try {
            return await this.productAssignDashboardService.getTotalAssignedAndStockLast30Days(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProductAssignmentSummary(req) {
        try {
            return await this.productAssignDashboardService.getProductAssignmentSummary(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProductDetailsByBranch(req) {
        try {
            return await this.productAssignDashboardService.getProductDetailsByBranch(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProductWareHouseDetails(req) {
        try {
            return await this.productAssignDashboardService.getProductWareHouseDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getWareHouseProductDetailsByBranch(req) {
        try {
            return await this.productAssignDashboardService.getWareHouseProductDetailsByBranch(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProductDetailsBy(req) {
        try {
            return await this.productAssignDashboardService.getProductDetailsBy(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getBranchManagerDetailProduct(req) {
        try {
            return await this.productAssignDashboardService.getBranchManagerDetailProduct(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getDetailVendorData(req) {
        try {
            return await this.vendorDashboardService.getDetailVendorData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async totalProducts(req) {
        try {
            return await this.productAssignDashboardService.totalProducts(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getDetailSubDealerData(req) {
        try {
            return await this.subDealerDashboardService.getDetailSubDealerData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getClientData(req) {
        try {
            return await this.clientDashboardService.getClientData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getDetailClientData(req) {
        try {
            return await this.clientDashboardService.getDetailClientData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getSearchDetailClient(req) {
        try {
            return await this.clientDashboardService.getSearchDetailClient(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getVendorData(req) {
        try {
            return await this.vendorDashboardService.getVendorData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getSubDealerData(req) {
        try {
            return await this.subDealerDashboardService.getSubDealerData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getAllAppointmentDetails(req) {
        try {
            return await this.appointmentDashboardService.getAllAppointmentDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async totalTickets(req) {
        try {
            return await this.ticketsDashboardService.totalTickets(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async totalTicketsBranchWise(req) {
        try {
            return await this.ticketsDashboardService.totalTicketsBranchWise(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getDayBookData(req) {
        try {
            return await this.voucherDashboardService.getDayBookData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getSolidLiquidCash(req) {
        try {
            return await this.voucherDashboardService.getSolidLiquidCash(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getReceivableAmountForTable(req) {
        try {
            return await this.voucherDashboardService.getReceivableAmountForTable(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getAllPaymentsVouchers(req) {
        try {
            return await this.voucherDashboardService.getAllPaymentsVouchers(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getSalesForTable(req) {
        try {
            return await this.voucherDashboardService.getSalesForTable(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getPayableAmountForTable(req) {
        try {
            return await this.voucherDashboardService.getPayableAmountForTable(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getPurchaseDataForTable(req) {
        try {
            return await this.voucherDashboardService.getPurchaseDataForTable(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getAmountDetails(req) {
        try {
            return await this.voucherDashboardService.getAmountDetails(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getVoucherAmountDetails(req) {
        try {
            return await this.voucherDashboardService.getVoucherAmountDetails(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async calculateGstReturns(req) {
        try {
            return await this.voucherDashboardService.calculateGstReturns(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getBranchWiseSolidLiquidCash(req) {
        try {
            return await this.voucherDashboardService.getBranchWiseSolidLiquidCash(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getBranchWiseAccountAmounts(req) {
        try {
            return await this.voucherDashboardService.getBranchWiseAccountAmounts(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getTotalPayableAndReceivablePercentage(req) {
        try {
            return await this.voucherDashboardService.getTotalPayableAndReceivablePercentage(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
        }
    }
    async getVoucherData(req) {
        try {
            return await this.voucherDashboardService.getVoucherData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getExpansesTableData(req) {
        try {
            return await this.voucherDashboardService.getExpansesTableData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getDetailInVoiceData(req) {
        try {
            return await this.voucherDashboardService.getDetailInVoiceData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getReceiptData(req) {
        try {
            return await this.voucherDashboardService.getReceiptData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProductsPhotos(req) {
        try {
            return await this.voucherDashboardService.getProductsPhotos(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getTrialBalance(req) {
        try {
            return await this.voucherDashboardService.getTrialBalance(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getBalanceSheet(req) {
        try {
            return await this.voucherDashboardService.getBalanceSheet(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getSalesReturns(req) {
        try {
            return await this.voucherDashboardService.getSalesReturns(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getTDSReport(req) {
        try {
            return await this.voucherDashboardService.getTDSReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getTCSReport(req) {
        try {
            return await this.voucherDashboardService.getTCSReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getDEBITNOTEReport(req) {
        try {
            return await this.voucherDashboardService.getDEBITNOTEReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getCREDITNOTEReport(req) {
        try {
            return await this.voucherDashboardService.getCREDITNOTEReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getJOURNALReport(req) {
        try {
            return await this.voucherDashboardService.getJOURNALReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getPURCHASEReport(req) {
        try {
            return await this.voucherDashboardService.getPURCHASEReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getSALESReport(req) {
        try {
            return await this.voucherDashboardService.getSALESReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getLedgerReport(req) {
        try {
            return await this.voucherDashboardService.getLedgerReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getPayableAmountForReport(req) {
        try {
            return await this.voucherDashboardService.getPayableAmountForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getCashFlow(req) {
        try {
            return await this.voucherDashboardService.getCashFlow(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getBankReconciliationReport(req) {
        try {
            return await this.voucherDashboardService.getBankReconciliationReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getBankStmtForReport(req) {
        try {
            return await this.voucherDashboardService.getBankStmtForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getCashStmtForReport(req) {
        try {
            return await this.voucherDashboardService.getCashStmtForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getLoansAndInterestsForReport(req) {
        try {
            return await this.voucherDashboardService.getLoansAndInterestsForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getFixedAssertsForReport(req) {
        try {
            return await this.voucherDashboardService.getFixedAssertsForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProfitAndLoss(req) {
        try {
            return await this.voucherDashboardService.getProfitAndLoss(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async generateIncomeStatement(req) {
        try {
            return await this.voucherDashboardService.generateIncomeStatement(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getTotalSalesForReport(req) {
        try {
            return await this.voucherDashboardService.getTotalSalesForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getPaymentData(req) {
        try {
            return await this.voucherDashboardService.getPaymentData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getPurchaseData(req) {
        try {
            return await this.voucherDashboardService.getPurchaseData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getClientPurchaseOrderDataTable(req) {
        try {
            return await this.voucherDashboardService.getClientPurchaseOrderDataTable(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getAllVouchers(req) {
        try {
            return await this.voucherDashboardService.getAllVouchers(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getMonthWiseBalance(req) {
        try {
            return await this.voucherDashboardService.getMonthWiseBalance(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getTotalProductAndServiceSales(req) {
        try {
            return await this.voucherDashboardService.getTotalProductAndServiceSales(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getDayBookDataForReport(req) {
        try {
            return await this.voucherDashboardService.getDayBookDataForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getReceiptDataForReport(req) {
        try {
            return await this.voucherDashboardService.getReceiptDataForReport(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getYearWiseCreditAndDebitPercentages(req) {
        try {
            return await this.voucherDashboardService.getYearWiseCreditAndDebitPercentages(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async get4YearWiseCreditAndDebitPercentages(req) {
        try {
            return await this.voucherDashboardService.get4YearWiseCreditAndDebitPercentages(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getPurchaseCount(req) {
        try {
            return await this.voucherDashboardService.getPurchaseCount(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getLast30DaysCreditAndDebitPercentages(req) {
        try {
            return await this.voucherDashboardService.getLast30DaysCreditAndDebitPercentages(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getProductTypeCreditAndDebitPercentages(req) {
        try {
            return await this.voucherDashboardService.getProductTypeCreditAndDebitPercentages(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async get4ProductTypeCreditAndDebitPercentages(req) {
        try {
            return await this.voucherDashboardService.get4ProductTypeCreditAndDebitPercentages(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getOverAllYearlySales(req) {
        try {
            return await this.voucherDashboardService.getOverAllYearlySales(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getBranchWiseMonthlySales(req) {
        try {
            return await this.voucherDashboardService.getBranchWiseMonthlySales(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getBranchWiseYearlySales(req) {
        try {
            return await this.voucherDashboardService.getBranchWiseYearlySales(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getSalesBreakdown(req) {
        try {
            return await this.voucherDashboardService.getSalesBreakdown(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getPaymentDataTable(req) {
        try {
            return await this.voucherDashboardService.getPaymentDataTable(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getPurchaseOrderDataTable(req) {
        try {
            return await this.voucherDashboardService.getPurchaseOrderDataTable(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
    async getAccountBySearch(req) {
        try {
            return await this.accountDashboardService.getAccountBySearch(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
        }
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('sendReciept'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_send_dto_1.EstimateSendDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "sendReciept", null);
__decorate([
    (0, common_1.Get)('sendInvoice'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_send_dto_1.EstimateSendDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "sendInvoice", null);
__decorate([
    (0, common_1.Get)('sendReceipt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_send_dto_1.EstimateSendDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "sendReceipt", null);
__decorate([
    (0, common_1.Get)('sendEstimate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_send_dto_1.EstimateSendDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "sendEstimate", null);
__decorate([
    (0, common_1.Post)('assertsCardData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "assertsCardData", null);
__decorate([
    (0, common_1.Post)('getAssertDataByDate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAssertDataByDate", null);
__decorate([
    (0, common_1.Post)('staffAttendanceDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_date_dto_1.StaffAttendanceQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "staffAttendanceDetails", null);
__decorate([
    (0, common_1.Post)('getStaffSearchDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_search_dto_1.StaffSearchDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStaffSearchDetails", null);
__decorate([
    (0, common_1.Post)('getStaff'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStaff", null);
__decorate([
    (0, common_1.Post)('getStaffCardsDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_search_dto_1.StaffSearchDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStaffCardsDetails", null);
__decorate([
    (0, common_1.Post)('getTotalStaffDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_search_dto_1.StaffSearchDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTotalStaffDetails", null);
__decorate([
    (0, common_1.Post)('getBranchStaffDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_search_dto_1.StaffSearchDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBranchStaffDetails", null);
__decorate([
    (0, common_1.Post)('getAllBranchStaffDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_search_dto_1.StaffSearchDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAllBranchStaffDetails", null);
__decorate([
    (0, common_1.Post)('payRoll'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "payRoll", null);
__decorate([
    (0, common_1.Post)('productAssignDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "productAssignDetails", null);
__decorate([
    (0, common_1.Post)('getProductAssignmentSummaryBySubDealer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductAssignmentSummaryBySubDealer", null);
__decorate([
    (0, common_1.Post)('productSubDealerAssignDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "productSubDealerAssignDetails", null);
__decorate([
    (0, common_1.Post)('getProductDetailsBySubDealer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductDetailsBySubDealer", null);
__decorate([
    (0, common_1.Post)('getSearchDetailProductAssign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_id_dto_1.ProductIdDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSearchDetailProductAssign", null);
__decorate([
    (0, common_1.Post)('getStockSummary'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_id_dto_1.ProductIdDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStockSummary", null);
__decorate([
    (0, common_1.Post)('getTicketDetailsAgainstSearch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_search_dto_1.TicketsSearchDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTicketDetailsAgainstSearch", null);
__decorate([
    (0, common_1.Post)('getEstimates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getEstimates", null);
__decorate([
    (0, common_1.Post)('getEstimatesForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getEstimatesForReport", null);
__decorate([
    (0, common_1.Post)('getTotalAssignedAndStockLast30Days'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTotalAssignedAndStockLast30Days", null);
__decorate([
    (0, common_1.Post)('getProductAssignmentSummary'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductAssignmentSummary", null);
__decorate([
    (0, common_1.Post)('getProductDetailsByBranch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductDetailsByBranch", null);
__decorate([
    (0, common_1.Post)('getProductWareHouseDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductWareHouseDetails", null);
__decorate([
    (0, common_1.Post)('getWareHouseProductDetailsByBranch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getWareHouseProductDetailsByBranch", null);
__decorate([
    (0, common_1.Post)('getProductDetailsBy'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductDetailsBy", null);
__decorate([
    (0, common_1.Post)('getBranchManagerDetailProduct'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBranchManagerDetailProduct", null);
__decorate([
    (0, common_1.Post)('getDetailVendorData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendor_id_deatil_1.VendorDetail]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDetailVendorData", null);
__decorate([
    (0, common_1.Post)('totalProducts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "totalProducts", null);
__decorate([
    (0, common_1.Post)('getDetailSubDealerData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detail_sub_dealer_dto_1.DetailSubDealerDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDetailSubDealerData", null);
__decorate([
    (0, common_1.Post)('getClientData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getClientData", null);
__decorate([
    (0, common_1.Post)('getDetailClientData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detail_client_dto_1.ClientDetailDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDetailClientData", null);
__decorate([
    (0, common_1.Post)('getSearchDetailClient'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_search_dto_1.ClientSearchDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSearchDetailClient", null);
__decorate([
    (0, common_1.Post)('getVendorData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getVendorData", null);
__decorate([
    (0, common_1.Post)('getSubDealerData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSubDealerData", null);
__decorate([
    (0, common_1.Post)('getAllAppointmentDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAllAppointmentDetails", null);
__decorate([
    (0, common_1.Post)('totalTickets'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "totalTickets", null);
__decorate([
    (0, common_1.Post)('totalTicketsBranchWise'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "totalTicketsBranchWise", null);
__decorate([
    (0, common_1.Post)('getDayBookData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDayBookData", null);
__decorate([
    (0, common_1.Post)('getSolidLiquidCash'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSolidLiquidCash", null);
__decorate([
    (0, common_1.Post)('getReceivableAmountForTable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getReceivableAmountForTable", null);
__decorate([
    (0, common_1.Post)('getAllPaymentsVouchers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAllPaymentsVouchers", null);
__decorate([
    (0, common_1.Post)('getSalesForTable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSalesForTable", null);
__decorate([
    (0, common_1.Post)('getPayableAmountForTable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPayableAmountForTable", null);
__decorate([
    (0, common_1.Post)('getPurchaseDataForTable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPurchaseDataForTable", null);
__decorate([
    (0, common_1.Post)('getAmountDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAmountDetails", null);
__decorate([
    (0, common_1.Post)('getVoucherAmountDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getVoucherAmountDetails", null);
__decorate([
    (0, common_1.Post)('calculateGstReturns'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "calculateGstReturns", null);
__decorate([
    (0, common_1.Post)('getBranchWiseSolidLiquidCash'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBranchWiseSolidLiquidCash", null);
__decorate([
    (0, common_1.Post)('getBranchWiseAccountAmounts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBranchWiseAccountAmounts", null);
__decorate([
    (0, common_1.Post)('getTotalPayableAndReceivablePercentage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTotalPayableAndReceivablePercentage", null);
__decorate([
    (0, common_1.Post)('getVoucherData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_dto_1.InvoiceDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getVoucherData", null);
__decorate([
    (0, common_1.Post)('getExpansesTableData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_dto_1.InvoiceDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getExpansesTableData", null);
__decorate([
    (0, common_1.Post)('getDetailInVoiceData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [voucher_id_res_dto_1.VoucherIDResDTo]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDetailInVoiceData", null);
__decorate([
    (0, common_1.Post)('getReceiptData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getReceiptData", null);
__decorate([
    (0, common_1.Post)('getProductsPhotos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductsPhotos", null);
__decorate([
    (0, common_1.Post)('getTrialBalance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTrialBalance", null);
__decorate([
    (0, common_1.Post)('getBalanceSheet'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBalanceSheet", null);
__decorate([
    (0, common_1.Post)('getSalesReturns'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSalesReturns", null);
__decorate([
    (0, common_1.Post)('getTDSReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTDSReport", null);
__decorate([
    (0, common_1.Post)('getTCSReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTCSReport", null);
__decorate([
    (0, common_1.Post)('getDEBITNOTEReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDEBITNOTEReport", null);
__decorate([
    (0, common_1.Post)('getCREDITNOTEReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCREDITNOTEReport", null);
__decorate([
    (0, common_1.Post)('getJOURNALReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getJOURNALReport", null);
__decorate([
    (0, common_1.Post)('getPURCHASEReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPURCHASEReport", null);
__decorate([
    (0, common_1.Post)('getSALESReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSALESReport", null);
__decorate([
    (0, common_1.Post)('getLedgerReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLedgerReport", null);
__decorate([
    (0, common_1.Post)('getPayableAmountForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPayableAmountForReport", null);
__decorate([
    (0, common_1.Post)('getCashFlow'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCashFlow", null);
__decorate([
    (0, common_1.Post)('getBankReconciliationReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBankReconciliationReport", null);
__decorate([
    (0, common_1.Post)('getBankStmtForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBankStmtForReport", null);
__decorate([
    (0, common_1.Post)('getCashStmtForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCashStmtForReport", null);
__decorate([
    (0, common_1.Post)('getLoansAndInterestsForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLoansAndInterestsForReport", null);
__decorate([
    (0, common_1.Post)('getFixedAssertsForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getFixedAssertsForReport", null);
__decorate([
    (0, common_1.Post)('getProfitAndLoss'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProfitAndLoss", null);
__decorate([
    (0, common_1.Post)('generateIncomeStatement'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "generateIncomeStatement", null);
__decorate([
    (0, common_1.Post)('getTotalSalesForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTotalSalesForReport", null);
__decorate([
    (0, common_1.Post)('getPaymentData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPaymentData", null);
__decorate([
    (0, common_1.Post)('getPurchaseData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPurchaseData", null);
__decorate([
    (0, common_1.Post)('getClientPurchaseOrderDataTable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getClientPurchaseOrderDataTable", null);
__decorate([
    (0, common_1.Post)('getAllVouchers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAllVouchers", null);
__decorate([
    (0, common_1.Post)('getMonthWiseBalance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMonthWiseBalance", null);
__decorate([
    (0, common_1.Post)('getTotalProductAndServiceSales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTotalProductAndServiceSales", null);
__decorate([
    (0, common_1.Post)('getDayBookDataForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDayBookDataForReport", null);
__decorate([
    (0, common_1.Post)('getReceiptDataForReport'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getReceiptDataForReport", null);
__decorate([
    (0, common_1.Post)('getYearWiseCreditAndDebitPercentages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getYearWiseCreditAndDebitPercentages", null);
__decorate([
    (0, common_1.Post)('get4YearWiseCreditAndDebitPercentages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "get4YearWiseCreditAndDebitPercentages", null);
__decorate([
    (0, common_1.Post)('getPurchaseCount'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPurchaseCount", null);
__decorate([
    (0, common_1.Post)('getLast30DaysCreditAndDebitPercentages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLast30DaysCreditAndDebitPercentages", null);
__decorate([
    (0, common_1.Post)('getProductTypeCreditAndDebitPercentages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductTypeCreditAndDebitPercentages", null);
__decorate([
    (0, common_1.Post)('get4ProductTypeCreditAndDebitPercentages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "get4ProductTypeCreditAndDebitPercentages", null);
__decorate([
    (0, common_1.Post)('getOverAllYearlySales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getOverAllYearlySales", null);
__decorate([
    (0, common_1.Post)('getBranchWiseMonthlySales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBranchWiseMonthlySales", null);
__decorate([
    (0, common_1.Post)('getBranchWiseYearlySales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBranchWiseYearlySales", null);
__decorate([
    (0, common_1.Post)('getSalesBreakdown'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSalesBreakdown", null);
__decorate([
    (0, common_1.Post)('getPaymentDataTable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPaymentDataTable", null);
__decorate([
    (0, common_1.Post)('getPurchaseOrderDataTable'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPurchaseOrderDataTable", null);
__decorate([
    (0, common_1.Post)('getAccountBySearch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAccountBySearch", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboards'),
    __metadata("design:paramtypes", [assert_dashboard_service_1.AssertDashboardService,
        staff_dashboard_service_1.StaffDashboardService,
        product_assign_dashboard_service_1.ProductAssignDashboardService,
        client_dashboards_service_1.ClientDashboardService,
        vendor_dashboard_service_1.VendorDashboardService,
        sub_dealer_dashboard_service_1.SubDealerDashboardService,
        appointment_dashboard_service_1.AppointmentDashboardService,
        tickets_dashboard_service_1.TicketsDashboardService,
        voucher_dashboard_service_1.VoucherDashboardService,
        estimate_dashboard_service_1.EstimateDashboardService,
        account_dashboard_service_1.AccountDashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map