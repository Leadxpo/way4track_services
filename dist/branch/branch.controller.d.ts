import { BranchService } from './branch.service';
import { BranchDto } from './dto/branch.dto';
import { BranchIdDto } from './dto/branch-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { CommonReq } from 'src/models/common-req';
export declare class BranchController {
    private readonly branchService;
    constructor(branchService: BranchService);
    saveBranchDetails(dto: BranchDto, photos: {
        photo?: Express.Multer.File[];
        image?: Express.Multer.File[];
    }): Promise<CommonResponse>;
    deleteBranchDetails(dto: BranchIdDto): Promise<CommonResponse>;
    getBranchDetails(req: CommonReq): Promise<CommonResponse>;
    getBranchDetailsById(req: BranchIdDto): Promise<CommonResponse>;
    getBranchStaff(req: BranchIdDto): Promise<CommonResponse>;
    getBranchNamesDropDown(): Promise<CommonResponse>;
}
