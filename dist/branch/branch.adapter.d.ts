import { BranchEntity } from "./entity/branch.entity";
import { BranchDto } from "./dto/branch.dto";
export declare class BranchAdapter {
    convertBranchDtoToEntity(dto: BranchDto): BranchEntity;
}
