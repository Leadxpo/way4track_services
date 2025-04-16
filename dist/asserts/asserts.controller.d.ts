import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { AssertsService } from './asserts.service';
import { AssertsIdDto } from './dto/asserts-id.dto';
import { AssertsDto } from './dto/asserts.dto';
export declare class AssertsController {
    private readonly assertsService;
    constructor(assertsService: AssertsService);
    createAssert(createAssertsDto: AssertsDto, photo: Express.Multer.File): Promise<CommonResponse>;
    deleteAssertDetails(dto: AssertsIdDto): Promise<CommonResponse>;
    getAssertDetails(req: AssertsIdDto): Promise<CommonResponse>;
    getAllAssertDetails(req: CommonReq): Promise<CommonResponse>;
}
