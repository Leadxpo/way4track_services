
import { Injectable } from "@nestjs/common";
import { CommonResponse } from "src/models/common-response";
import { BranchChartDto } from "src/voucher/dto/balance-chart.dto";
import { VoucherIDResDTo } from "src/voucher/dto/voucher-id.res.dto";
import { VoucherRepository } from "src/voucher/repo/voucher.repo";

@Injectable()
export class VoucherDashboardService {

    constructor(
        private voucherRepository: VoucherRepository,
    ) { }
    async getVoucherData(): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getInVoiceData()
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

    async getReceiptData(): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getReceiptData()
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPaymentData(): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getPaymentData()
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPurchaseData(): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getPurchaseData()
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getLedgerData(): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getLedgerData()
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

    async getPurchaseCount(): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getPurchaseCount()
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getExpenseData(): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getExpenseData()
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getLast30DaysCreditAndDebitPercentages(): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getLast30DaysCreditAndDebitPercentages()
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }
}