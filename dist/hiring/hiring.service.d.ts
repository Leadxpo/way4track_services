import { HiringDto } from './dto/hiring.dto';
import { HiringAdapter } from './hiring.adapter';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from './dto/hiring-id.dto';
import { HiringRepository } from './repo/hiring.repo';
import { HiringFilterDto } from './dto/hiring-filter.dto';
export declare class HiringService {
    private readonly hiringAdapter;
    private readonly hiringRepository;
    constructor(hiringAdapter: HiringAdapter, hiringRepository: HiringRepository);
    saveHiringDetails(dto: HiringDto): Promise<CommonResponse>;
    getHiringDetails(req: HiringIdDto): Promise<CommonResponse>;
    deleteHiringDetails(req: HiringIdDto): Promise<CommonResponse>;
    uploadResume(hiringId: number, file: Express.Multer.File): Promise<CommonResponse>;
    getHiringSearchDetails(req: HiringFilterDto): Promise<any[]>;
}
