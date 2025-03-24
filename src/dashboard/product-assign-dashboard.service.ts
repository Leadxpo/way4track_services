import { Injectable } from "@nestjs/common";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { ProductAssignRepository } from "src/product-assign/repo/product-assign.repo";
import { ProductIdDto } from "src/product/dto/product.id.dto";

@Injectable()
export class ProductAssignDashboardService {

    constructor(
        private productAssignRepo: ProductAssignRepository,
    ) { }
    async productAssignDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.productAssignDetails(req)
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }

    async getSearchDetailProduct(req:
        ProductIdDto
    ): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.getSearchDetailProduct(req)
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }

    async getTotalAssignedAndStockLast30Days(req: CommonReq): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.getTotalAssignedAndStockLast30Days(req)
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }

    async getProductAssignmentSummary(req: { unitCode: string; companyCode: string; branch?: string, staffId?: string }): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.getProductAssignmentSummary(req)
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }


    async getProductDetailsByBranch(req: { unitCode: string; companyCode: string; branch?: string }): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.getProductDetailsByBranch(req);

        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        } else {
            // Flatten the response to remove nested "data of data"
            return new CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }


    async getProductWareHouseDetails(req: { unitCode: string; companyCode: string; }): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.getProductWareHouseDetails(req)
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }

    async getWareHouseProductDetailsByBranch(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.getWareHouseProductDetailsByBranch(req)
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }

    async getBranchManagerDetailProduct(req: {
        companyCode: string, unitCode: string, branchName?: string 
    }): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.getBranchManagerDetailProduct(req)
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }



    async totalProducts(req: CommonReq): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.totalProducts(req)
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }


}