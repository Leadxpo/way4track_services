import { Body, Controller, Get, Post } from "@nestjs/common"
import { CommonResponse } from "src/models/common-response"
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
import { AccountIdDto } from "src/account/dto/account.id.dto";
import { ClientSearchDto } from "src/client/dto/client-search.dto";
import { EstimateSendDto } from "src/estimate/dto/estimate.send.dto";
import { ProductIdDto } from "src/product/dto/product.id.dto";



@Controller('dashboards')
export class DashboardController {
    constructor(
        private readonly assertService: AssertDashboardService,
        private readonly staffDashboardService: StaffDashboardService,
        private readonly productAssignDashboardService: ProductAssignDashboardService,
        private readonly clientDashboardService: ClientDashboardService,
        private readonly vendorDashboardService: VendorDashboardService,
        private readonly subDealerDashboardService: SubDealerDashboardService,
        private readonly appointmentDashboardService: AppointmentDashboardService,
        private readonly ticketsDashboardService: TicketsDashboardService,
        private readonly voucherDashboardService: VoucherDashboardService,
        private readonly estimateDashboardService: EstimateDashboardService,
        private readonly accountDashboardService: AccountDashboardService,

    ) { }
    @Get('sendReciept')
    async sendReciept(@Body() dto: EstimateSendDto): Promise<CommonResponse> {
        try {
            return await this.estimateDashboardService.sendReceipt(dto)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            // return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Get('sendInvoice')
    async sendInvoice(@Body() dto: EstimateSendDto): Promise<CommonResponse> {
        try {
            return await this.estimateDashboardService.sendInvoice(dto)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            // return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Get('sendReceipt')
    async sendReceipt(@Body() dto: EstimateSendDto): Promise<CommonResponse> {
        try {
            return await this.estimateDashboardService.sendReceipt(dto)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            // return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Get('sendEstimate')
    async sendEstimate(@Body() dto: EstimateSendDto): Promise<CommonResponse> {
        try {
            return await this.estimateDashboardService.sendEstimate(dto)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Post('assertsCardData')
    async assertsCardData(@Body() req: {
        unitCode: string;
        companyCode: string; branch?: string
    }): Promise<CommonResponse> {
        try {
            return await this.assertService.assertsCardData(req)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Post('getAssertDataByDate')
    async getAssertDataByDate(@Body() req: {
        fromDate?: Date; toDate?: Date; companyCode?: string,
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            return await this.assertService.getAssertDataByDate(req)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Post('staffAttendanceDetails')
    async staffAttendanceDetails(@Body() req: StaffAttendanceQueryDto): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.staffAttendanceDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getStaffSearchDetails')
    async getStaffSearchDetails(@Body() req: StaffSearchDto): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.getStaffSearchDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getStaff')
    async getStaff(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.getStaff(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getStaffCardsDetails')
    async getStaffCardsDetails(@Body() req: StaffSearchDto): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.getStaffCardsDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getTotalStaffDetails')
    async getTotalStaffDetails(@Body() req: StaffSearchDto): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.getTotalStaffDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getBranchStaffDetails')
    async getBranchStaffDetails(@Body() req: StaffSearchDto): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.getBranchStaffDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getAllBranchStaffDetails')
    async getAllBranchStaffDetails(@Body() req: StaffSearchDto): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.getAllBranchStaffDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('payRoll')
    async payRoll(@Body() req: {
        branch?: string;
        companyCode: string;
        unitCode: string;
        date: string
    }): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.payRoll(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('productAssignDetails')
    async productAssignDetails(@Body() req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.productAssignDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getSearchDetailProductAssign')
    async getSearchDetailProductAssign(@Body() req: ProductIdDto): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.getSearchDetailProduct(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getTicketDetailsAgainstSearch')
    async getTicketDetailsAgainstSearch(@Body() req: TicketsSearchDto): Promise<CommonResponse> {
        try {
            return await this.ticketsDashboardService.getTicketDetailsAgainstSearch(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getEstimates')
    async getEstimates(@Body() req: {
        fromDate?: string; toDate?: string; status?: ClientStatusEnum; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            return await this.estimateDashboardService.getEstimates(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getEstimatesForReport')
    async getEstimatesForReport(@Body() req: {
        estimateId?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            return await this.estimateDashboardService.getEstimatesForReport(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getTotalAssignedAndStockLast30Days')
    async getTotalAssignedAndStockLast30Days(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.getTotalAssignedAndStockLast30Days(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }



    @Post('getProductAssignmentSummary')
    async getProductAssignmentSummary(@Body() req: { unitCode: string; companyCode: string; branch?: string, staffId?: string }): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.getProductAssignmentSummary(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getProductDetailsByBranch')
    async getProductDetailsByBranch(@Body() req: { unitCode: string; companyCode: string; branch?: string }): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.getProductDetailsByBranch(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getProductWareHouseDetails')
    async getProductWareHouseDetails(@Body() req: { unitCode: string; companyCode: string; }): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.getProductWareHouseDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }




    @Post('getDetailVendorData')
    async getDetailVendorData(@Body() req: VendorDetail): Promise<CommonResponse> {
        try {
            return await this.vendorDashboardService.getDetailVendorData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('totalProducts')
    async totalProducts(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.totalProducts(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getDetailSubDealerData')
    async getDetailSubDealerData(@Body() req: DetailSubDealerDto): Promise<CommonResponse> {
        try {
            return await this.subDealerDashboardService.getDetailSubDealerData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getClientData')
    async getClientData(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.clientDashboardService.getClientData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getDetailClientData')
    async getDetailClientData(@Body() req: ClientDetailDto): Promise<CommonResponse> {
        try {
            return await this.clientDashboardService.getDetailClientData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getSearchDetailClient')
    async getSearchDetailClient(@Body() req: ClientSearchDto): Promise<CommonResponse> {
        try {
            return await this.clientDashboardService.getSearchDetailClient(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getVendorData')
    async getVendorData(@Body() req: {
        fromDate?: Date; toDate?: Date; paymentStatus?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            return await this.vendorDashboardService.getVendorData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getSubDealerData')
    async getSubDealerData(@Body() req: {
        fromDate?: Date; toDate?: Date; paymentStatus?: PaymentStatus; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            return await this.subDealerDashboardService.getSubDealerData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getAllAppointmentDetails')
    async getAllAppointmentDetails(@Body() req: { unitCode: string; companyCode: string; branch?: string, staffId?: string }): Promise<CommonResponse> {
        try {
            return await this.appointmentDashboardService.getAllAppointmentDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('totalTickets')
    async totalTickets(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.ticketsDashboardService.totalTickets(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('totalTicketsBranchWise')
    async totalTicketsBranchWise(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.ticketsDashboardService.totalTicketsBranchWise(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getDayBookData')
    async getDayBookData(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getDayBookData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getSolidLiquidCash')
    async getSolidLiquidCash(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getSolidLiquidCash(req)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            // return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Post('getBranchWiseSolidLiquidCash')
    async getBranchWiseSolidLiquidCash(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getBranchWiseSolidLiquidCash(req)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            // return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Post('getTotalPayableAndReceivablePercentage')
    async getTotalPayableAndReceivablePercentage(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getTotalPayableAndReceivablePercentage(req)
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            // return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }


    @Post('getVoucherData')
    async getVoucherData(@Body() req: InvoiceDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getVoucherData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getExpansesTableData')
    async getExpansesTableData(@Body() req: InvoiceDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getExpansesTableData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getDetailInVoiceData')
    async getDetailInVoiceData(@Body() req: VoucherIDResDTo): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getDetailInVoiceData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getReceiptData')
    async getReceiptData(@Body() req: {
        voucherId?: string; clientName?: string; paymentStatus?: PaymentStatus; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getReceiptData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getProductsPhotos')
    async getProductsPhotos(@Body() req: {
        subDealerId?: string;
        vendorId?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getProductsPhotos(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getTotalSalesForReport')
    async getTotalSalesForReport(@Body() req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getTotalSalesForReport(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getPaymentData')
    async getPaymentData(@Body() req: {
        fromDate?: Date; toDate?: Date; paymentStatus?: PaymentStatus; companyCode?: string;
        unitCode?: string; staffId?: string
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getPaymentData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getPurchaseData')
    async getPurchaseData(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getPurchaseData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }



    @Post('getClientPurchaseOrderDataTable')
    async getClientPurchaseOrderDataTable(@Body() req: {
        phoneNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getClientPurchaseOrderDataTable(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    // @Post('getLedgerDataById')
    // async getLedgerDataById(@Body() req: {
    //     subDealerId?: number; clientId?: number; vendorId?: number; companyCode?: string; unitCode?: string
    // }): Promise<CommonResponse> {
    //     try {
    //         return await this.voucherDashboardService.getLedgerDataById(req)
    //     }
    //     catch (error) {
    //         console.log("Error in details in service..", error);
    //         //         return new CommonResponse(false, 500, 'Error details');
    //     }
    // }

    @Post('getAllVouchers')
    async getAllVouchers(@Body() req: {
        voucherId?: number; branchName?: string; paymentStatus?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getAllVouchers(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    // @Post('getDetailLedgerData')
    // async getDetailLedgerData(@Body() req: VoucherIDResDTo): Promise<CommonResponse> {
    //     try {
    //         return await this.voucherDashboardService.getDetailLedgerData(req)
    //     }
    //     catch (error) {
    //         console.log("Error in details in service..", error);
    //         //         return new CommonResponse(false, 500, 'Error details');
    //     }
    // }


    @Post('getMonthWiseBalance')
    async getMonthWiseBalance(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getMonthWiseBalance(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getTotalProductAndServiceSales')
    async getTotalProductAndServiceSales(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getTotalProductAndServiceSales(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getDayBookDataForReport')
    async getDayBookDataForReport(@Body() req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getDayBookDataForReport(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    // @Post('getLedgerDataForReport')
    // async getLedgerDataForReport(@Body() req: {
    //     fromDate?: string;
    //     toDate?: string;
    //     clientName?: string;
    //     companyCode?: string;
    //     unitCode?: string;
    // }): Promise<CommonResponse> {
    //     try {
    //         return await this.voucherDashboardService.getLedgerDataForReport(req)
    //     }
    //     catch (error) {
    //         console.log("Error in details in service..", error);
    //         //         return new CommonResponse(false, 500, 'Error details');
    //     }
    // }

    @Post('getReceiptDataForReport')
    async getReceiptDataForReport(@Body() req: {
        voucherId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getReceiptDataForReport(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getYearWiseCreditAndDebitPercentages')
    async getYearWiseCreditAndDebitPercentages(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getYearWiseCreditAndDebitPercentages(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('get4YearWiseCreditAndDebitPercentages')
    async get4YearWiseCreditAndDebitPercentages(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.get4YearWiseCreditAndDebitPercentages(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getPurchaseCount')
    async getPurchaseCount(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getPurchaseCount(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    // @Post('getExpenseData')
    // async getExpenseData(@Body() req: CommonReq): Promise<CommonResponse> {
    //     try {
    //         return await this.voucherDashboardService.getExpenseData(req)
    //     }
    //     catch (error) {
    //         console.log("Error in details in service..", error);
    //         //         return new CommonResponse(false, 500, 'Error details');
    //     }
    // }

    @Post('getLast30DaysCreditAndDebitPercentages')
    async getLast30DaysCreditAndDebitPercentages(@Body() req: { companyCode: string, unitCode: string, branchName?: string }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getLast30DaysCreditAndDebitPercentages(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getProductTypeCreditAndDebitPercentages')
    async getProductTypeCreditAndDebitPercentages(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getProductTypeCreditAndDebitPercentages(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('get4ProductTypeCreditAndDebitPercentages')
    async get4ProductTypeCreditAndDebitPercentages(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.get4ProductTypeCreditAndDebitPercentages(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getOverAllYearlySales')
    async getOverAllYearlySales(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getOverAllYearlySales(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getBranchWiseMonthlySales')
    async getBranchWiseMonthlySales(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getBranchWiseMonthlySales(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getBranchWiseYearlySales')
    async getBranchWiseYearlySales(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getBranchWiseYearlySales(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getSalesBreakdown')
    async getSalesBreakdown(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getSalesBreakdown(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getPaymentDataTable')
    async getPaymentDataTable(@Body() req: {
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getPaymentDataTable(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getPurchaseOrderDataTable')
    async getPurchaseOrderDataTable(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getPurchaseOrderDataTable(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getAccountBySearch')
    async getAccountBySearch(@Body() req: {
        accountName?: string; accountNumber?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            return await this.accountDashboardService.getAccountBySearch(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

    // @Post('addVoucherAmount')
    // async addVoucherAmount(@Body() req: AccountIdDto): Promise<CommonResponse> {
    //     try {
    //         return await this.accountDashboardService.addVoucherAmount(req)
    //     }
    //     catch (error) {
    //         console.log("Error in details in service..", error);
    // return new CommonResponse(false, 500, 'Error details');
    // }
    // }
}