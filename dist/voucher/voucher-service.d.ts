import { AccountRepository } from "src/account/repo/account.repo";
import { EstimateRepository } from "src/estimate/repo/estimate.repo";
import { CommonResponse } from "src/models/common-response";
import { VoucherResDto } from "./dto/voucher-res.dto";
import { VoucherDto } from "./dto/voucher.dto";
import { VoucherEntity } from "./entity/voucher.entity";
import { VoucherRepository } from "./repo/voucher.repo";
import { VoucherAdapter } from "./voucher.adapter";
import { ProductRepository } from "src/product/repo/product.repo";
import { LedgerRepository } from "src/ledger/repo/ledger.repo";
export declare class VoucherService {
    private readonly voucherRepository;
    private readonly voucherAdapter;
    private readonly estimateRepo;
    private readonly accountRepository;
    private readonly productRepository;
    private readonly ledgerRepo;
    private storage;
    private bucketName;
    constructor(voucherRepository: VoucherRepository, voucherAdapter: VoucherAdapter, estimateRepo: EstimateRepository, accountRepository: AccountRepository, productRepository: ProductRepository, ledgerRepo: LedgerRepository);
    private generateVoucherNumber;
    updateVoucher(voucherDto: VoucherDto): Promise<CommonResponse>;
    createVoucher(voucherDto: VoucherDto, receiptPdf?: string | null): Promise<CommonResponse>;
    getPendingVouchers(req: {
        ledgerId: number;
    }): Promise<{
        status: boolean;
        errorCode: number;
        data: VoucherEntity[];
        internalMessage: string;
    }>;
    getBankAmount(req: VoucherDto): Promise<{
        status: boolean;
        errorCode: number;
        data: {
            fromAccountAmount: number;
            toAccountAmount: number;
        };
        internalMessage: string;
    }>;
    handleVoucher(voucherDto: VoucherDto, pdf?: Express.Multer.File): Promise<CommonResponse>;
    getAllVouchers(): Promise<VoucherResDto[]>;
    deleteVoucherDetails(dto: {
        voucherId: string;
    }): Promise<CommonResponse>;
    getVoucherNamesDropDown(): Promise<CommonResponse>;
}
