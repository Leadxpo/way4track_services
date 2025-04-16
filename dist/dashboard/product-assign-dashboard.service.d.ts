import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { ProductAssignRepository } from "src/product-assign/repo/product-assign.repo";
import { ProductIdDto } from "src/product/dto/product.id.dto";
export declare class ProductAssignDashboardService {
    private productAssignRepo;
    constructor(productAssignRepo: ProductAssignRepository);
    productAssignDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    productSubDealerAssignDetails(req: {
        subDealerId?: string;
        companyCode: string;
        unitCode: string;
        subDealerName?: string;
    }): Promise<CommonResponse>;
    getProductAssignmentSummaryBySubDealer(req: {
        subDealerId?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse>;
    getProductDetailsBySubDealer(req: {
        unitCode: string;
        companyCode: string;
        subDealerId?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<CommonResponse>;
    getSearchDetailProduct(req: ProductIdDto): Promise<CommonResponse>;
    getStockSummary(req: ProductIdDto): Promise<CommonResponse>;
    getTotalAssignedAndStockLast30Days(req: CommonReq): Promise<CommonResponse>;
    getProductAssignmentSummary(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        staffId?: string;
    }): Promise<CommonResponse>;
    getProductDetailsByBranch(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
    }): Promise<CommonResponse>;
    getProductWareHouseDetails(req: {
        unitCode: string;
        companyCode: string;
    }): Promise<CommonResponse>;
    getWareHouseProductDetailsByBranch(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<CommonResponse>;
    getProductDetailsBy(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<CommonResponse>;
    getBranchManagerDetailProduct(req: {
        companyCode: string;
        unitCode: string;
        branchName?: string;
    }): Promise<CommonResponse>;
    totalProducts(req: CommonReq): Promise<CommonResponse>;
}
