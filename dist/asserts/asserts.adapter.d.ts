import { VoucherRepository } from "src/voucher/repo/voucher.repo";
import { AssertsDto } from "./dto/asserts.dto";
import { GetAssertsResDto } from "./dto/get-asserts-res.dto";
import { AssertsEntity } from "./entity/asserts-entity";
import { BranchRepository } from "src/branch/repo/branch.repo";
export declare class AssertsAdapter {
    private readonly voucherRepository;
    private readonly branchRepository;
    constructor(voucherRepository: VoucherRepository, branchRepository: BranchRepository);
    convertEntityToDto(entity: AssertsEntity): GetAssertsResDto;
    convertDtoToEntity(dto: AssertsDto): Promise<AssertsEntity>;
}
