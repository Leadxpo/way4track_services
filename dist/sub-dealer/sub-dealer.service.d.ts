import { LoginDto } from 'src/login/dto/login.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerRepository } from './repo/sub-dealer.repo';
import { SubDealerAdapter } from './sub-dealer.adapter';
export declare class SubDealerService {
    private readonly subDealerAdapter;
    private readonly subDealerRepository;
    private storage;
    private bucketName;
    constructor(subDealerAdapter: SubDealerAdapter, subDealerRepository: SubDealerRepository);
    private generateSubDealerId;
    updateSubDealerDetails(dto: SubDealerDto, filePath: string | null): Promise<CommonResponse>;
    createSubDealerDetails(dto: SubDealerDto, filePath: string | null): Promise<CommonResponse>;
    handleSubDealerDetails(dto: SubDealerDto, photo?: Express.Multer.File): Promise<CommonResponse>;
    deleteSubDealerDetails(dto: SubDealerIdDto): Promise<CommonResponse>;
    getSubDealerDetails(req: CommonReq): Promise<CommonResponse>;
    getSubDealerDetailById(req: SubDealerIdDto): Promise<CommonResponse>;
    getSubDealerNamesDropDown(): Promise<CommonResponse>;
    getSubDealerProfileDetails(req: LoginDto): Promise<CommonResponse>;
}
