import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerService } from './sub-dealer.service';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { CommonReq } from 'src/models/common-req';
export declare class SubDealerController {
    private readonly subDealerService;
    constructor(subDealerService: SubDealerService);
    handleSubDealerDetails(dto: SubDealerDto, photo?: Express.Multer.File): Promise<CommonResponse>;
    deleteSubDealerDetails(dto: SubDealerIdDto): Promise<CommonResponse>;
    getSubDealerDetailById(dto: SubDealerIdDto): Promise<CommonResponse>;
    getSubDealerDetails(dto: CommonReq): Promise<CommonResponse>;
    getSubDealerNamesDropDown(): Promise<CommonResponse>;
}
