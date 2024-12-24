import { AssertsDto } from './dto/asserts.dto';
import { AssertsIdDto } from './dto/asserts-id.dto';
import { AssertsService } from './asserts.service';
import { CommonResponse } from 'src/models/common-response';
export declare class AssertsController {
    private readonly assertsService;
    constructor(assertsService: AssertsService);
    saveAssertDetails(dto: AssertsDto): Promise<CommonResponse>;
    deleteAssertDetails(dto: AssertsIdDto): Promise<CommonResponse>;
    getAssertDetails(req: AssertsIdDto): Promise<CommonResponse>;
    uploadPhoto(assertId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
