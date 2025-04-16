import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { BranchAdapter } from './branch.adapter';
import { BranchIdDto } from './dto/branch-id.dto';
import { BranchDto } from './dto/branch.dto';
import { BranchRepository } from './repo/branch.repo';
export declare class BranchService {
    private readonly adapter;
    private readonly branchRepo;
    private storage;
    private bucketName;
    constructor(adapter: BranchAdapter, branchRepo: BranchRepository);
    saveBranchDetails(dto: BranchDto, photos?: {
        photo?: Express.Multer.File[];
        image?: Express.Multer.File[];
    }): Promise<CommonResponse>;
    deleteBranchDetails(dto: BranchIdDto): Promise<CommonResponse>;
    getBranchDetails(req: CommonReq): Promise<CommonResponse>;
    getBranchStaff(req: BranchIdDto): Promise<CommonResponse>;
    getBranchDetailsById(req: BranchIdDto): Promise<CommonResponse>;
    getBranchNamesDropDown(): Promise<CommonResponse>;
}
