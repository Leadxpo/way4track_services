import { AssertsDto } from './dto/asserts.dto';
import { AssertsIdDto } from './dto/asserts-id.dto';
import { AssertsRepository } from './repo/asserts.repo';
import { CommonResponse } from 'src/models/common-response';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { AssertsAdapter } from './asserts.adapter';
import { BranchRepository } from 'src/branch/repo/branch.repo';
export declare class AssertsService {
    private adapter;
    private assertsRepository;
    private voucherRepo;
    private readonly branchRepo;
    constructor(adapter: AssertsAdapter, assertsRepository: AssertsRepository, voucherRepo: VoucherRepository, branchRepo: BranchRepository);
    getAssertDetails(req: AssertsIdDto): Promise<CommonResponse>;
    create(createAssertsDto: AssertsDto): Promise<CommonResponse>;
    deleteAssertDetails(dto: AssertsIdDto): Promise<CommonResponse>;
    uploadAssertPhoto(assertId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
