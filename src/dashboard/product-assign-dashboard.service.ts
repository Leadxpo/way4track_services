import { Injectable } from "@nestjs/common";
import { CommonResponse } from "src/models/common-response";
import { ProductAssignRepository } from "src/product-assign/repo/product-assign.repo";

@Injectable()
export class ProductAssignDashboardService {

    constructor(
        private productAssignRepo: ProductAssignRepository,
    ) { }
    async productAssignDetails(): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.productAssignDetails()
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }

    async getTotalAssignedAndStockLast30Days(): Promise<CommonResponse> {
        const productData = await this.productAssignRepo.getTotalAssignedAndStockLast30Days()
        if (!productData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", productData)
        }
    }
}