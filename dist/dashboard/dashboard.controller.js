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
let DashboardController = class DashboardController {
    constructor(assertService, staffDashboardService, productAssignDashboardService, clientDashboardService, vendorDashboardService, subDealerDashboardService, appointmentDashboardService, ticketsDashboardService, voucherDashboardService, estimateDashboardService) {
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
    }
    async assertCardData(req) {
        try {
            return await this.assertService.assertCardData(req);
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
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getStaffSearchDetails(req) {
        try {
            return await this.staffDashboardService.getStaffSearchDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async payRoll(req) {
        try {
            return await this.staffDashboardService.payRoll(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async productAssignDetails(req) {
        try {
            return await this.productAssignDashboardService.productAssignDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getTicketDetailsAgainstSearch(req) {
        try {
            return await this.ticketsDashboardService.getTicketDetailsAgainstSearch(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getEstimates(req) {
        try {
            return await this.estimateDashboardService.getEstimates(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getTotalAssignedAndStockLast30Days(req) {
        try {
            return await this.productAssignDashboardService.getTotalAssignedAndStockLast30Days(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getAssignedQtyLast30Days(req) {
        try {
            return await this.productAssignDashboardService.getAssignedQtyLast30Days(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getDetailVendorData(req) {
        try {
            return await this.vendorDashboardService.getDetailVendorData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getDetailSubDealerData(req) {
        try {
            return await this.subDealerDashboardService.getDetailSubDealerData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getClientData(req) {
        try {
            return await this.clientDashboardService.getClientData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getDetailClientData(req) {
        try {
            return await this.clientDashboardService.getDetailClientData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getVendorData(req) {
        try {
            return await this.vendorDashboardService.getVendorData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getSubDealerData(req) {
        try {
            return await this.subDealerDashboardService.getSubDealerData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getAllAppointmentDetails(req) {
        try {
            return await this.appointmentDashboardService.getAllAppointmentDetails(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async totalTickets(req) {
        try {
            return await this.ticketsDashboardService.totalTickets(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getDayBookData(req) {
        try {
            return await this.voucherDashboardService.getDayBookData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getSolidLiquidCash(req) {
        try {
            return await this.voucherDashboardService.getSolidLiquidCash(req);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async getVoucherData(req) {
        try {
            return await this.voucherDashboardService.getVoucherData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getDetailInVoiceData(req) {
        try {
            return await this.voucherDashboardService.getDetailInVoiceData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getReceiptData(req) {
        try {
            return await this.voucherDashboardService.getReceiptData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getPaymentData(req) {
        try {
            return await this.voucherDashboardService.getPaymentData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getPurchaseData(req) {
        try {
            return await this.voucherDashboardService.getPurchaseData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getLedgerData(req) {
        try {
            return await this.voucherDashboardService.getLedgerData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getAllVouchers(req) {
        try {
            return await this.voucherDashboardService.getAllVouchers(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getDetailLedgerData(req) {
        try {
            return await this.voucherDashboardService.getDetailLedgerData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getMonthWiseBalance(req) {
        try {
            return await this.voucherDashboardService.getMonthWiseBalance(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getYearWiseCreditAndDebitPercentages(req) {
        try {
            return await this.voucherDashboardService.getYearWiseCreditAndDebitPercentages(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getPurchaseCount(req) {
        try {
            return await this.voucherDashboardService.getPurchaseCount(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getExpenseData(req) {
        try {
            return await this.voucherDashboardService.getExpenseData(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
    async getLast30DaysCreditAndDebitPercentages(req) {
        try {
            return await this.voucherDashboardService.getLast30DaysCreditAndDebitPercentages(req);
        }
        catch (error) {
            console.log("Error in details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error details');
        }
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Post)('assertCardData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "assertCardData", null);
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
    (0, common_1.Post)('payRoll'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "payRoll", null);
__decorate([
    (0, common_1.Post)('productAssignDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "productAssignDetails", null);
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
    (0, common_1.Post)('getTotalAssignedAndStockLast30Days'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTotalAssignedAndStockLast30Days", null);
__decorate([
    (0, common_1.Post)('getAssignedQtyLast30Days'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAssignedQtyLast30Days", null);
__decorate([
    (0, common_1.Post)('getDetailVendorData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendor_id_deatil_1.VendorDetail]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDetailVendorData", null);
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
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
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
    (0, common_1.Post)('getVoucherData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_dto_1.InvoiceDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getVoucherData", null);
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
    (0, common_1.Post)('getLedgerData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLedgerData", null);
__decorate([
    (0, common_1.Post)('getAllVouchers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAllVouchers", null);
__decorate([
    (0, common_1.Post)('getDetailLedgerData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [voucher_id_res_dto_1.VoucherIDResDTo]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDetailLedgerData", null);
__decorate([
    (0, common_1.Post)('getMonthWiseBalance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMonthWiseBalance", null);
__decorate([
    (0, common_1.Post)('getYearWiseCreditAndDebitPercentages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balance_chart_dto_1.BranchChartDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getYearWiseCreditAndDebitPercentages", null);
__decorate([
    (0, common_1.Post)('getPurchaseCount'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPurchaseCount", null);
__decorate([
    (0, common_1.Post)('getExpenseData'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getExpenseData", null);
__decorate([
    (0, common_1.Post)('getLast30DaysCreditAndDebitPercentages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLast30DaysCreditAndDebitPercentages", null);
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
        estimate_dashboard_service_1.EstimateDashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map