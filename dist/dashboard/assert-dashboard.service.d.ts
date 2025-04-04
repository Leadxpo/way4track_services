import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
export declare class AssertDashboardService {
    private assertRepo;
    constructor(assertRepo: AssertsRepository);
    assertCardData(req: CommonReq): Promise<CommonResponse>;
}
