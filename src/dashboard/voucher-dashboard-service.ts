
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

    async getExpansesTableData(req: InvoiceDto): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getExpansesTableData(req)
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
        unitCode?: string; staffId?: string
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

    async getTotalSalesForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
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

            return new CommonResponse(true, 200, 'Data retrieved successfully', data);
        } catch (err) {
            console.error('Error in getTotalSalesForReport:', err);
            return new CommonResponse(false, 500, 'An error occurred while fetching data');
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

    async getTotalProductAndServiceSales(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getTotalProductAndServiceSales(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getLedgerDataForReport(req: {
        fromDate?: string;
        toDate?: string;
        clientName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        try {
            const data = [];
            const VoucherData = await this.voucherRepository.getLedgerDataForReport(req)
            for (const row of VoucherData) {
                const obj = {
                    voucherId: row.voucherId,
                    name: row.name,
                    clientName: row.clientName,
                    generationDate: row.generationDate,
                    expireDate: row.expireDate,
                    paymentStatus: row.paymentStatus,
                    phoneNumber: row.phoneNumber,
                    email: row.email,
                    address: row.address,
                    creditAmount: row.creditAmount,
                    debitAmount: row.debitAmount,
                    balanceAmount: row.balanceAmount,
                    purpose: row.purpose,
                    branchName: row.branchName,
                }
                data.push(obj)
            }
            return new CommonResponse(true, 200, 'Data retrieved successfully', data);
        } catch (err) {
            console.error('Error in getTotalSalesForReport:', err);
            return new CommonResponse(false, 500, 'An error occurred while fetching data');
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

    async getDayBookDataForReport(req: {
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        try {
            const data = [];
            const VoucherData = await this.voucherRepository.getDayBookDataForReport(req)
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
                }
                data.push(obj)
            }
            return new CommonResponse(true, 200, 'Data retrieved successfully', data);
        } catch (err) {
            console.error('Error in getTotalSalesForReport:', err);
            return new CommonResponse(false, 500, 'An error occurred while fetching data');
        }
    }

    async getLedgerDataTable(req: {
        clientId?: number; branchName?: string; clientName?: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getLedgerDataTable(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getClientPurchaseOrderDataTable(req: {
        phoneNumber?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getClientPurchaseOrderDataTable(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getLedgerDataById(req: {
        subDealerId?: number; clientId?: number; vendorId?: number; companyCode?: string; unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getLedgerDataById(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getReceiptDataForReport(req: {
        voucherId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getReceiptDataForReport(req)
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

    async getLast30DaysCreditAndDebitPercentages(req: { companyCode: string, unitCode: string, branchName?: string }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getLast30DaysCreditAndDebitPercentages(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getProductTypeCreditAndDebitPercentages(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getProductTypeCreditAndDebitPercentages(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPurchaseOrderDataTable(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getPurchaseOrderDataTable(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPaymentDataTable(req: {
        companyCode?: string;
        unitCode?: string;
        staffId?: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getPaymentDataTable(req)
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

    async getBranchWiseSolidLiquidCash(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.voucherRepository.getBranchWiseSolidLiquidCash(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }


}