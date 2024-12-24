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
    async getTotalAssignedAndStockLast30Days(req) {
        const productData = await this.productAssignRepo.getTotalAssignedAndStockLast30Days(req);
        if (!productData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", productData);
        }
    }
    async getAssignedQtyLast30Days(req) {
        const productData = await this.productAssignRepo.getAssignedQtyLast30Days(req);
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