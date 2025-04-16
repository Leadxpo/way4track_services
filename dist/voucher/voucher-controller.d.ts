import { VoucherDto } from './dto/voucher.dto';
import { CommonResponse } from 'src/models/common-response';
import { VoucherService } from './voucher-service';
export declare class VoucherController {
    private readonly voucherService;
    constructor(voucherService: VoucherService);
    saveVoucher(dto: VoucherDto, file?: Express.Multer.File): Promise<CommonResponse>;
    deleteVoucher(dto: {
        voucherId: string;
    }): Promise<CommonResponse>;
    getPendingVouchers(dto: {
        ledgerId: number;
    }): Promise<CommonResponse>;
    getAllVouchers(): Promise<CommonResponse>;
    getVoucherNamesDropDown(): Promise<CommonResponse>;
}
