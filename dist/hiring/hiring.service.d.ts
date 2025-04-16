import { HiringDto } from './dto/hiring.dto';
import { HiringAdapter } from './hiring.adapter';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from './dto/hiring-id.dto';
import { HiringRepository } from './repo/hiring.repo';
import { HiringFilterDto } from './dto/hiring-filter.dto';
import { CommonReq } from 'src/models/common-req';
export declare class HiringService {
    private readonly hiringAdapter;
    private readonly hiringRepository;
    private storage;
    private bucketName;
    constructor(hiringAdapter: HiringAdapter, hiringRepository: HiringRepository);
    saveHiringDetails(dto: HiringDto, resumeFile?: Express.Multer.File): Promise<CommonResponse>;
    uploadResume(file: Express.Multer.File): Promise<string>;
    getHiringDetailsById(req: HiringIdDto): Promise<CommonResponse>;
    getHiringDetails(req: CommonReq): Promise<CommonResponse>;
    deleteHiringDetails(req: HiringIdDto): Promise<CommonResponse>;
    getHiringSearchDetails(req: HiringFilterDto): Promise<CommonResponse>;
    getCandidatesStatsLast30Days(req: CommonReq): Promise<{
        totalAttended: number;
        totalQualified: number;
    }>;
    getHiringTodayDetails(req: CommonReq): Promise<any[]>;
}
