import { BranchService } from './branch.service';
import { BranchDto } from './dto/branch.dto';
import { BranchIdDto } from './dto/branch-id.dto';
import { CommonResponse } from 'src/models/common-response';
export declare class BranchController {
    private readonly branchService;
    constructor(branchService: BranchService);
    saveBranchDetails(dto: BranchDto): Promise<CommonResponse>;
    deleteBranchDetails(dto: BranchIdDto): Promise<CommonResponse>;
    getBranchDetails(req: BranchIdDto): Promise<CommonResponse>;
    getBranchNamesDropDown(): Promise<CommonResponse>;
    uploadPhoto(branchId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
