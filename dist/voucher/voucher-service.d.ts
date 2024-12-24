import { VoucherDto } from "./dto/voucher.dto";
import { CommonResponse } from "src/models/common-response";
import { VoucherIdDto } from "./dto/voucher-id.dto";
import { VoucherAdapter } from "./voucher.adapter";
import { VoucherRepository } from "./repo/voucher.repo";
import { BranchRepository } from "src/branch/repo/branch.repo";
import { ClientRepository } from "src/client/repo/client.repo";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";
import { VendorRepository } from "src/vendor/repo/vendor.repo";
import { VoucherResDto } from "./dto/voucher-res.dto";
export declare class VoucherService {
    private readonly voucherRepository;
    private readonly branchRepository;
    private readonly clientRepository;
    private readonly subDealerRepository;
    private readonly vendorRepository;
    private readonly voucherAdapter;
    constructor(voucherRepository: VoucherRepository, branchRepository: BranchRepository, clientRepository: ClientRepository, subDealerRepository: SubDealerRepository, vendorRepository: VendorRepository, voucherAdapter: VoucherAdapter);
    private generateVoucherNumber;
    updateVoucher(voucherDto: VoucherDto): Promise<CommonResponse>;
    createVoucher(voucherDto: VoucherDto): Promise<CommonResponse>;
    handleVoucher(voucherDto: VoucherDto): Promise<CommonResponse>;
    getAllVouchers(): Promise<VoucherResDto[]>;
    deleteVoucherDetails(dto: VoucherIdDto): Promise<CommonResponse>;
    getVoucherNamesDropDown(): Promise<CommonResponse>;
}
