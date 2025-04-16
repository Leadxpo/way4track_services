import { BranchRepository } from 'src/branch/repo/branch.repo';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { AssertsAdapter } from './asserts.adapter';
import { AssertsIdDto } from './dto/asserts-id.dto';
import { AssertsDto } from './dto/asserts.dto';
import { AssertsRepository } from './repo/asserts.repo';
export declare class AssertsService {
    private adapter;
    private assertsRepository;
    private voucherRepo;
    private readonly branchRepo;
    private storage;
    private bucketName;
    constructor(adapter: AssertsAdapter, assertsRepository: AssertsRepository, voucherRepo: VoucherRepository, branchRepo: BranchRepository);
    getAssertDetails(req: AssertsIdDto): Promise<CommonResponse>;
    getAllAssertDetails(req: CommonReq): Promise<CommonResponse>;
    create(createAssertsDto: AssertsDto, photo: Express.Multer.File): Promise<CommonResponse>;
    deleteAssertDetails(dto: AssertsIdDto): Promise<CommonResponse>;
}
