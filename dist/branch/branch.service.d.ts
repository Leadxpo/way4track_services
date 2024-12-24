import { BranchRepository } from './repo/branch.repo';
import { BranchAdapter } from './branch.adapter';
import { BranchDto } from './dto/branch.dto';
import { BranchIdDto } from './dto/branch-id.dto';
import { CommonResponse } from 'src/models/common-response';
export declare class BranchService {
    private adapter;
    private branchRepo;
    constructor(adapter: BranchAdapter, branchRepo: BranchRepository);
    saveBranchDetails(dto: BranchDto): Promise<CommonResponse>;
    deleteBranchDetails(dto: BranchIdDto): Promise<CommonResponse>;
    getBranchDetails(req: BranchIdDto): Promise<CommonResponse>;
    getBranchNamesDropDown(): Promise<CommonResponse>;
    uploadBranchPhoto(branchId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
