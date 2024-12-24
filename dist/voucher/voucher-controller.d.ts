import { VoucherDto } from './dto/voucher.dto';
import { CommonResponse } from 'src/models/common-response';
import { VoucherIdDto } from './dto/voucher-id.dto';
import { VoucherService } from './voucher-service';
export declare class VoucherController {
    private readonly voucherService;
    constructor(voucherService: VoucherService);
    saveVoucher(dto: VoucherDto): Promise<CommonResponse>;
    deleteVoucher(dto: VoucherIdDto): Promise<CommonResponse>;
    getAllVouchers(): Promise<CommonResponse>;
    getVoucherNamesDropDown(): Promise<CommonResponse>;
}
