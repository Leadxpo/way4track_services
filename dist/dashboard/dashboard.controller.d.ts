import { CommonResponse } from "src/models/common-response";
import { AssertDashboardService } from "./assert-dashboard.service";
import { StaffDashboardService } from "./staff-dashboard.service";
import { StaffAttendanceQueryDto } from "src/staff/dto/staff-date.dto";
import { ProductAssignDashboardService } from "./product-assign-dashboard.service";
import { ClientDashboardService } from "./client-dashboards.service";
import { VendorDashboardService } from "./vendor-dashboard.service";
import { SubDealerDashboardService } from "./sub-dealer-dashboard-service";
import { AppointmentDashboardService } from "./appointment-dashboard.service";
import { TicketsDashboardService } from "./tickets-dashboard.service";
import { VoucherDashboardService } from "./voucher-dashboard-service";
import { BranchChartDto } from "src/voucher/dto/balance-chart.dto";
import { VendorDetail } from "src/vendor/dto/vendor-id.deatil";
import { DetailSubDealerDto } from "src/sub-dealer/dto/detail-sub-dealer.dto";
import { ClientDetailDto } from "src/client/dto/detail.client.dto";
import { VoucherIDResDTo } from "src/voucher/dto/voucher-id.res.dto";
import { InvoiceDto } from "src/voucher/dto/invoice.dto";
import { StaffSearchDto } from "src/staff/dto/staff-search.dto";
import { TicketsSearchDto } from "src/tickets/dto/ticket-search.dto";
import { EstimateDashboardService } from "./estimate-dashboard.service";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { CommonReq } from "src/models/common-req";
import { AccountDashboardService } from "./account.dashboard.service";
import { ClientSearchDto } from "src/client/dto/client-search.dto";
import { EstimateSendDto } from "src/estimate/dto/estimate.send.dto";
import { ProductIdDto } from "src/product/dto/product.id.dto";
export declare class DashboardController {
    private readonly assertService;
    private readonly staffDashboardService;
    private readonly productAssignDashboardService;
    private readonly clientDashboardService;
    private readonly vendorDashboardService;
    private readonly subDealerDashboardService;
    private readonly appointmentDashboardService;
    private readonly ticketsDashboardService;
    private readonly voucherDashboardService;
    private readonly estimateDashboardService;
    private readonly accountDashboardService;
    constructor(assertService: AssertDashboardService, staffDashboardService: StaffDashboardService, productAssignDashboardService: ProductAssignDashboardService, clientDashboardService: ClientDashboardService, vendorDashboardService: VendorDashboardService, subDealerDashboardService: SubDealerDashboardService, appointmentDashboardService: AppointmentDashboardService, ticketsDashboardService: TicketsDashboardService, voucherDashboardService: VoucherDashboardService, estimateDashboardService: EstimateDashboardService, accountDashboardService: AccountDashboardService);
    sendReciept(dto: EstimateSendDto): Promise<CommonResponse>;
    sendInvoice(dto: EstimateSendDto): Promise<CommonResponse>;
    sendReceipt(dto: EstimateSendDto): Promise<CommonResponse>;
    sendEstimate(dto: EstimateSendDto): Promise<CommonResponse>;
    assertsCardData(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
    }): Promise<CommonResponse>;
    getAssertDataByDate(req: {
        fromDate?: Date;
        toDate?: Date;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    staffAttendanceDetails(req: StaffAttendanceQueryDto): Promise<CommonResponse>;
    getStaffSearchDetails(req: StaffSearchDto): Promise<CommonResponse>;
    getStaff(req: CommonReq): Promise<CommonResponse>;
    getStaffCardsDetails(req: StaffSearchDto): Promise<CommonResponse>;
    getTotalStaffDetails(req: StaffSearchDto): Promise<CommonResponse>;
    getBranchStaffDetails(req: StaffSearchDto): Promise<CommonResponse>;
    getAllBranchStaffDetails(req: StaffSearchDto): Promise<CommonResponse>;
    payRoll(req: {
        branch?: string;
        companyCode: string;
        unitCode: string;
        date: string;
    }): Promise<CommonResponse>;
    productAssignDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getProductAssignmentSummaryBySubDealer(req: {
        subDealerId?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse>;
    productSubDealerAssignDetails(req: {
        subDealerId?: string;
        companyCode: string;
        unitCode: string;
        subDealerName?: string;
    }): Promise<CommonResponse>;
    getProductDetailsBySubDealer(req: {
        unitCode: string;
        companyCode: string;
        subDealerId?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<CommonResponse>;
    getSearchDetailProductAssign(req: ProductIdDto): Promise<CommonResponse>;
    getStockSummary(req: ProductIdDto): Promise<CommonResponse>;
    getTicketDetailsAgainstSearch(req: TicketsSearchDto): Promise<CommonResponse>;
    getEstimates(req: {
        fromDate?: string;
        toDate?: string;
        status?: ClientStatusEnum;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getEstimatesForReport(req: {
        estimateId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getTotalAssignedAndStockLast30Days(req: CommonReq): Promise<CommonResponse>;
    getProductAssignmentSummary(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        staffId?: string;
    }): Promise<CommonResponse>;
    getProductDetailsByBranch(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
    }): Promise<CommonResponse>;
    getProductWareHouseDetails(req: {
        unitCode: string;
        companyCode: string;
    }): Promise<CommonResponse>;
    getWareHouseProductDetailsByBranch(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<CommonResponse>;
    getProductDetailsBy(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<CommonResponse>;
    getBranchManagerDetailProduct(req: {
        companyCode: string;
        unitCode: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getDetailVendorData(req: VendorDetail): Promise<CommonResponse>;
    totalProducts(req: CommonReq): Promise<CommonResponse>;
    getDetailSubDealerData(req: DetailSubDealerDto): Promise<CommonResponse>;
    getClientData(req: CommonReq): Promise<CommonResponse>;
    getDetailClientData(req: ClientDetailDto): Promise<CommonResponse>;
    getSearchDetailClient(req: ClientSearchDto): Promise<CommonResponse>;
    getVendorData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getSubDealerData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getAllAppointmentDetails(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        staffId?: string;
    }): Promise<CommonResponse>;
    totalTickets(req: CommonReq): Promise<CommonResponse>;
    totalTicketsBranchWise(req: CommonReq): Promise<CommonResponse>;
    getDayBookData(req: BranchChartDto): Promise<CommonResponse>;
    getSolidLiquidCash(req: CommonReq): Promise<CommonResponse>;
    getReceivableAmountForTable(req: CommonReq): Promise<CommonResponse>;
    getAllPaymentsVouchers(req: CommonReq): Promise<CommonResponse>;
    getSalesForTable(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getPayableAmountForTable(req: CommonReq): Promise<CommonResponse>;
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
    getBranchWiseSolidLiquidCash(req: CommonReq): Promise<CommonResponse>;
    getBranchWiseAccountAmounts(req: CommonReq): Promise<CommonResponse>;
    getTotalPayableAndReceivablePercentage(req: BranchChartDto): Promise<CommonResponse>;
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
    getCashFlow(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getBankReconciliationReport(req: {
        companyCode: string;
        unitCode: string;
        fromDate: string;
        toDate: string;
        bankAccount?: string;
    }): Promise<CommonResponse>;
    getBankStmtForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        bankAccountNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getCashStmtForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getLoansAndInterestsForReport(req: {
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
    getProfitAndLoss(req: {
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
    getPaymentData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<CommonResponse>;
    getPurchaseData(req: CommonReq): Promise<CommonResponse>;
    getClientPurchaseOrderDataTable(req: {
        phoneNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getAllVouchers(req: {
        voucherId?: number;
        branchName?: string;
        paymentStatus?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getMonthWiseBalance(req: BranchChartDto): Promise<CommonResponse>;
    getTotalProductAndServiceSales(req: CommonReq): Promise<CommonResponse>;
    getDayBookDataForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getReceiptDataForReport(req: {
        voucherId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getYearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    get4YearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    getPurchaseCount(req: CommonReq): Promise<CommonResponse>;
    getLast30DaysCreditAndDebitPercentages(req: {
        companyCode: string;
        unitCode: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    getProductTypeCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    get4ProductTypeCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    getOverAllYearlySales(req: BranchChartDto): Promise<CommonResponse>;
    getBranchWiseMonthlySales(req: BranchChartDto): Promise<CommonResponse>;
    getBranchWiseYearlySales(req: BranchChartDto): Promise<CommonResponse>;
    getSalesBreakdown(req: BranchChartDto): Promise<CommonResponse>;
    getPaymentDataTable(req: {
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<CommonResponse>;
    getPurchaseOrderDataTable(req: CommonReq): Promise<CommonResponse>;
    getAccountBySearch(req: {
        accountName?: string;
        accountNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
}
