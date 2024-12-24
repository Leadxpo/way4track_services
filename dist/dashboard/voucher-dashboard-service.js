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
    async getPurchaseData(req) {
        const VoucherData = await this.voucherRepository.getPurchaseData(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getLedgerData(req) {
        const VoucherData = await this.voucherRepository.getLedgerData(req);
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
    async getDetailLedgerData(req) {
        const VoucherData = await this.voucherRepository.getDetailLedgerData(req);
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
    async getExpenseData(req) {
        const VoucherData = await this.voucherRepository.getExpenseData(req);
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
    async getSolidLiquidCash(req) {
        const VoucherData = await this.voucherRepository.getSolidLiquidCash(req);
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