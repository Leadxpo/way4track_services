import { HiringDto } from './dto/hiring.dto';
import { HiringService } from './hiring.service';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from './dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
export declare class HiringController {
    private readonly hiringService;
    constructor(hiringService: HiringService);
    saveHiringDetailsWithResume(dto: HiringDto, file: Express.Multer.File): Promise<CommonResponse>;
    getCandidatesStatsLast30Days(req: CommonReq): Promise<{
        totalAttended: number;
        totalQualified: number;
    }>;
    getHiringTodayDetails(req: CommonReq): Promise<any[]>;
    deleteHiringDetails(dto: HiringIdDto): Promise<CommonResponse>;
    getHiringDetailsById(dto: HiringIdDto): Promise<CommonResponse>;
    getHiringDetails(dto: CommonReq): Promise<CommonResponse>;
    getHiringSearchDetails(dto: CommonReq): Promise<CommonResponse>;
}
