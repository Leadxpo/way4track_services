import { HiringDto } from './dto/hiring.dto';
import { HiringService } from './hiring.service';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from './dto/hiring-id.dto';
import { HiringFilterDto } from './dto/hiring-filter.dto';
export declare class HiringController {
    private readonly hiringService;
    constructor(hiringService: HiringService);
    saveHiringDetails(dto: HiringDto): Promise<CommonResponse>;
    deleteHiringDetails(dto: HiringIdDto): Promise<CommonResponse>;
    getHiringDetails(dto: HiringIdDto): Promise<CommonResponse>;
    uploadResume(hiringId: number, file: Express.Multer.File): Promise<CommonResponse>;
    getHiringSearchDetails(req: HiringFilterDto): Promise<any[]>;
}
