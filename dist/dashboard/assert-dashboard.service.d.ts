import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonResponse } from "src/models/common-response";
export declare class AssertDashboardService {
    private assertRepo;
    constructor(assertRepo: AssertsRepository);
    assertsCardData(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
    }): Promise<CommonResponse>;
    getAssertDataByDate(req: {
        fromDate?: Date;
        toDate?: Date;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
}
