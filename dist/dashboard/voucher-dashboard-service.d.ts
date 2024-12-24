import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { BranchChartDto } from "src/voucher/dto/balance-chart.dto";
import { InvoiceDto } from "src/voucher/dto/invoice.dto";
import { VoucherIDResDTo } from "src/voucher/dto/voucher-id.res.dto";
import { VoucherRepository } from "src/voucher/repo/voucher.repo";
export declare class VoucherDashboardService {
    private voucherRepository;
    constructor(voucherRepository: VoucherRepository);
    getVoucherData(req: InvoiceDto): Promise<CommonResponse>;
    getDetailInVoiceData(req: VoucherIDResDTo): Promise<CommonResponse>;
    getReceiptData(req: {
        voucherId?: string;
        clientName?: string;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getPaymentData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getPurchaseData(req: CommonReq): Promise<CommonResponse>;
    getLedgerData(req: {
        voucherId?: number;
        branchName?: string;
        paymentStatus?: string;
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
    getDetailLedgerData(req: VoucherIDResDTo): Promise<CommonResponse>;
    getMonthWiseBalance(req: BranchChartDto): Promise<CommonResponse>;
    getYearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<CommonResponse>;
    getDayBookData(req: BranchChartDto): Promise<CommonResponse>;
    getPurchaseCount(req: CommonReq): Promise<CommonResponse>;
    getExpenseData(req: CommonReq): Promise<CommonResponse>;
    getLast30DaysCreditAndDebitPercentages(req: CommonReq): Promise<CommonResponse>;
    getSolidLiquidCash(req: CommonReq): Promise<CommonResponse>;
}
