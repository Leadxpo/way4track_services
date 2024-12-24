import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { ProductAssignRepository } from "src/product-assign/repo/product-assign.repo";
export declare class ProductAssignDashboardService {
    private productAssignRepo;
    constructor(productAssignRepo: ProductAssignRepository);
    productAssignDetails(req: CommonReq): Promise<CommonResponse>;
    getTotalAssignedAndStockLast30Days(req: CommonReq): Promise<CommonResponse>;
    getAssignedQtyLast30Days(req: CommonReq): Promise<CommonResponse>;
}
