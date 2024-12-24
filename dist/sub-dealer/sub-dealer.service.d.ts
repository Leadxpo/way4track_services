import { CommonResponse } from 'src/models/common-response';
import { SubDealerAdapter } from './sub-dealer.adapter';
import { SubDealerRepository } from './repo/sub-dealer.repo';
import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
export declare class SubDealerService {
    private readonly subDealerAdapter;
    private readonly subDealerRepository;
    constructor(subDealerAdapter: SubDealerAdapter, subDealerRepository: SubDealerRepository);
    private generateSubDealerId;
    updateSubDealerDetails(dto: SubDealerDto): Promise<CommonResponse>;
    createSubDealerDetails(dto: SubDealerDto): Promise<CommonResponse>;
    handleSubDealerDetails(dto: SubDealerDto): Promise<CommonResponse>;
    deleteSubDealerDetails(dto: SubDealerIdDto): Promise<CommonResponse>;
    getSubDealerDetails(req: SubDealerIdDto): Promise<CommonResponse>;
    getSubDealerNamesDropDown(): Promise<CommonResponse>;
    uploadSubDealerPhoto(subDealerId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
