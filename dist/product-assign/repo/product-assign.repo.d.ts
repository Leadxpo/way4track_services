import { DataSource, Repository } from "typeorm";
import { ProductAssignEntity } from "../entity/product-assign.entity";
import { CommonReq } from "src/models/common-req";
import { ProductIdDto } from "src/product/dto/product.id.dto";
export declare class ProductAssignRepository extends Repository<ProductAssignEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    productAssignDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any>;
    getSearchDetailProduct(req: ProductIdDto): Promise<any[]>;
    totalProducts(req: CommonReq): Promise<any>;
    getTotalAssignedAndStockLast30Days(req: CommonReq): Promise<any>;
    getProductAssignmentSummary(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        staffId?: string;
    }): Promise<{
        groupedBranches: {
            branchName: any;
        }[];
        totalAssignedQty: number;
        totalInHandsQty: number;
        totalQty: number;
    }>;
    getProductDetailsByBranch(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
    }): Promise<any[]>;
    getProductWareHouseDetails(req: {
        unitCode: string;
        companyCode: string;
    }): Promise<{
        status: boolean;
        errorCode: number;
        internalMessage: string;
        data: any[];
    }>;
    getBranchManagerDetailProduct(req: {
        companyCode: string;
        unitCode: string;
        branchName?: string;
    }): Promise<any[]>;
    getWareHouseProductDetailsByBranch(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<any[]>;
    getStockSummary(req: ProductIdDto): Promise<any[]>;
    getProductDetailsBy(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<any[]>;
    productSubDealerAssignDetails(req: {
        subDealerId?: string;
        companyCode: string;
        unitCode: string;
        subDealerName?: string;
    }): Promise<{
        result: any[];
        rawResults: any[];
    }>;
    getProductDetailsBySubDealer(req: {
        unitCode: string;
        companyCode: string;
        subDealerId?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<any[]>;
    getProductAssignmentSummaryBySubDealer(req: {
        unitCode: string;
        companyCode: string;
        subDealerId?: string;
    }): Promise<{
        groupedSubDealers: {
            subDealerId: any;
        }[];
        totalAssignedQty: number;
        totalInHandsQty: number;
        totalQty: number;
    }>;
}
