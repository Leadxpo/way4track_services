"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAssignDashboardService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const product_assign_repo_1 = require("../product-assign/repo/product-assign.repo");
let ProductAssignDashboardService = class ProductAssignDashboardService {
    constructor(productAssignRepo) {
        this.productAssignRepo = productAssignRepo;
    }
    async productAssignDetails(req) {
        const productData = await this.productAssignRepo.productAssignDetails(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async productSubDealerAssignDetails(req) {
        const productData = await this.productAssignRepo.productSubDealerAssignDetails(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getProductAssignmentSummaryBySubDealer(req) {
        const productData = await this.productAssignRepo.getProductAssignmentSummaryBySubDealer(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getProductDetailsBySubDealer(req) {
        const productData = await this.productAssignRepo.getProductDetailsBySubDealer(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getSearchDetailProduct(req) {
        const productData = await this.productAssignRepo.getSearchDetailProduct(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getStockSummary(req) {
        const productData = await this.productAssignRepo.getStockSummary(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getTotalAssignedAndStockLast30Days(req) {
        const productData = await this.productAssignRepo.getTotalAssignedAndStockLast30Days(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getProductAssignmentSummary(req) {
        const productData = await this.productAssignRepo.getProductAssignmentSummary(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getProductDetailsByBranch(req) {
        const productData = await this.productAssignRepo.getProductDetailsByBranch(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getProductWareHouseDetails(req) {
        const productData = await this.productAssignRepo.getProductWareHouseDetails(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getWareHouseProductDetailsByBranch(req) {
        const productData = await this.productAssignRepo.getWareHouseProductDetailsByBranch(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getProductDetailsBy(req) {
        const productData = await this.productAssignRepo.getProductDetailsBy(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getBranchManagerDetailProduct(req) {
        const productData = await this.productAssignRepo.getBranchManagerDetailProduct(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async totalProducts(req) {
        const productData = await this.productAssignRepo.totalProducts(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
};
exports.ProductAssignDashboardService = ProductAssignDashboardService;
exports.ProductAssignDashboardService = ProductAssignDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_assign_repo_1.ProductAssignRepository])
], ProductAssignDashboardService);
//# sourceMappingURL=product-assign-dashboard.service.js.map