import { DataSource, Repository } from "typeorm";
import { VoucherEntity } from "../entity/voucher.entity";
import { BranchChartDto } from "../dto/balance-chart.dto";
import { VoucherIDResDTo } from "../dto/voucher-id.res.dto";
import { InvoiceDto } from "../dto/invoice.dto";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { CommonReq } from "src/models/common-req";
export declare class VoucherRepository extends Repository<VoucherEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getInVoiceData(req: InvoiceDto): Promise<any[]>;
    getDetailInVoiceData(req: VoucherIDResDTo): Promise<any>;
    getReceiptData(filters: {
        voucherId?: string;
        clientName?: string;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getPaymentData(filters: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getPurchaseData(req: CommonReq): Promise<any[]>;
    getLedgerData(req: {
        voucherId?: number;
        branchName?: string;
        paymentStatus?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getDetailLedgerData(req: VoucherIDResDTo): Promise<any>;
    getAllVouchers(req: {
        voucherId?: number;
        branchName?: string;
        paymentStatus?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getMonthWiseBalance(req: BranchChartDto): Promise<any[]>;
    getYearWiseCreditAndDebitPercentages(req: BranchChartDto): Promise<any[]>;
    getDayBookData(req: BranchChartDto): Promise<any[]>;
    getPurchaseCount(req: CommonReq): Promise<any>;
    getExpenseData(req: CommonReq): Promise<any>;
    getLast30DaysCreditAndDebitPercentages(req: CommonReq): Promise<any[]>;
    getSolidLiquidCash(req: CommonReq): Promise<{
        solidCash: number;
        liquidCash: number;
    }>;
}
