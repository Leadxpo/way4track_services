import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerService } from './sub-dealer.service';
import { SubDealerIdDto } from './dto/sub-dealer-id.dto';
import { CommonResponse } from 'src/models/common-response';
export declare class SubDealerController {
    private readonly subDealerService;
    constructor(subDealerService: SubDealerService);
    handleSubDealerDetails(dto: SubDealerDto): Promise<CommonResponse>;
    deleteSubDealerDetails(dto: SubDealerIdDto): Promise<CommonResponse>;
    getSubDealerDetails(dto: SubDealerIdDto): Promise<CommonResponse>;
    getSubDealerNamesDropDown(): Promise<CommonResponse>;
    uploadPhoto(subDealerId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
