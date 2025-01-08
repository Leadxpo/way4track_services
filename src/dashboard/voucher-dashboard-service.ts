
import { Injectable } from "@nestjs/common";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { BranchChartDto } from "src/voucher/dto/balance-chart.dto";
import { InvoiceDto } from "src/voucher/dto/invoice.dto";
import { VoucherIDResDTo } from "src/voucher/dto/voucher-id.res.dto";
import { VoucherRepository } from "src/voucher/repo/voucher.repo";

@Injectable()
export class VoucherDashboardService {

    constructor(
        private voucherRepository: VoucherRepository,
    ) { }
    async getVoucherData(req: InvoiceDto): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getInVoiceData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getDetailInVoiceData(req: VoucherIDResDTo): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getDetailInVoiceData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getReceiptData(req: {
        voucherId?: string; clientName?: string; paymentStatus?: PaymentStatus; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getReceiptData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPaymentData(req: {
        fromDate?: Date; toDate?: Date; paymentStatus?: PaymentStatus; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getPaymentData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getProductsPhotos(req: {
        subDealerId?: string;
        vendorId?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getProductsPhotos(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPurchaseData(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getPurchaseData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getLedgerData(req: {
        voucherId?: number; branchName?: string; paymentStatus?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getLedgerData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getAllVouchers(req: {
        voucherId?: number; branchName?: string; paymentStatus?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getAllVouchers(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getDetailLedgerData(req: VoucherIDResDTo): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getDetailLedgerData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getMonthWiseBalance(req: BranchChartDto): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getMonthWiseBalance(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }


    async getYearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getYearWiseCreditAndDebitPercentages(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getDayBookData(req: BranchChartDto): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getDayBookData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPurchaseCount(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getPurchaseCount(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getExpenseData(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getExpenseData(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getLast30DaysCreditAndDebitPercentages(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getLast30DaysCreditAndDebitPercentages(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getSolidLiquidCash(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getSolidLiquidCash(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }


}