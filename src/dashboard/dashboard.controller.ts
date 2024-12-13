import { Body, Controller, Post } from "@nestjs/common"
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

    ) { }
    @Post('assertCardData')
    async assertCardData(): Promise<CommonResponse> {
        try {
            return await this.assertService.assertCardData()
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
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('payRoll')
    async payRoll(): Promise<CommonResponse> {
        try {
            return await this.staffDashboardService.payRoll()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('productAssignDetails')
    async productAssignDetails(): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.productAssignDetails()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getTotalAssignedAndStockLast30Days')
    async getTotalAssignedAndStockLast30Days(): Promise<CommonResponse> {
        try {
            return await this.productAssignDashboardService.getTotalAssignedAndStockLast30Days()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getDetailVendorData')
    async getDetailVendorData(@Body() req: VendorDetail): Promise<CommonResponse> {
        try {
            return await this.vendorDashboardService.getDetailVendorData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getDetailSubDealerData')
    async getDetailSubDealerData(@Body() req: DetailSubDealerDto): Promise<CommonResponse> {
        try {
            return await this.subDealerDashboardService.getDetailSubDealerData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getClientData')
    async getClientData(): Promise<CommonResponse> {
        try {
            return await this.clientDashboardService.getClientData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getDetailClientData')
    async getDetailClientData(@Body() req: ClientDetailDto): Promise<CommonResponse> {
        try {
            return await this.clientDashboardService.getDetailClientData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getVendorData')
    async getVendorData(): Promise<CommonResponse> {
        try {
            return await this.vendorDashboardService.getVendorData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getSubDealerData')
    async getSubDealerData(): Promise<CommonResponse> {
        try {
            return await this.subDealerDashboardService.getSubDealerData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getAllAppointmentDetails')
    async getAllAppointmentDetails(): Promise<CommonResponse> {
        try {
            return await this.appointmentDashboardService.getAllAppointmentDetails()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('totalTickets')
    async totalTickets(): Promise<CommonResponse> {
        try {
            return await this.ticketsDashboardService.totalTickets()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getDayBookData')
    async getDayBookData(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getDayBookData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getVoucherData')
    async getVoucherData(): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getVoucherData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getDetailInVoiceData')
    async getDetailInVoiceData(@Body() req: VoucherIDResDTo): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getDetailInVoiceData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getReceiptData')
    async getReceiptData(): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getReceiptData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getPaymentData')
    async getPaymentData(): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getPaymentData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getPurchaseData')
    async getPurchaseData(): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getPurchaseData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getLedgerData')
    async getLedgerData(): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getLedgerData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getDetailLedgerData')
    async getDetailLedgerData(@Body() req: VoucherIDResDTo): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getDetailLedgerData(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getMonthWiseBalance')
    async getMonthWiseBalance(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getMonthWiseBalance(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }


    @Post('getYearWiseCreditAndDebitPercentages')
    async getYearWiseCreditAndDebitPercentages(@Body() req: BranchChartDto): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getYearWiseCreditAndDebitPercentages(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getPurchaseCount')
    async getPurchaseCount(): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getPurchaseCount()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getExpenseData')
    async getExpenseData(): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getExpenseData()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }

    @Post('getLast30DaysCreditAndDebitPercentages')
    async getLast30DaysCreditAndDebitPercentages(): Promise<CommonResponse> {
        try {
            return await this.voucherDashboardService.getLast30DaysCreditAndDebitPercentages()
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new CommonResponse(false, 500, 'Error details');
        }
    }
}