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
exports.EstimateDashboardService = void 0;
const common_1 = require("@nestjs/common");
const estimate_repo_1 = require("../estimate/repo/estimate.repo");
const common_response_1 = require("../models/common-response");
let EstimateDashboardService = class EstimateDashboardService {
    constructor(repo) {
        this.repo = repo;
    }
    async getEstimates(req) {
        const VendorData = await this.repo.getEstimates(req);
        if (!VendorData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VendorData);
        }
    }
};
exports.EstimateDashboardService = EstimateDashboardService;
exports.EstimateDashboardService = EstimateDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [estimate_repo_1.EstimateRepository])
], EstimateDashboardService);
//# sourceMappingURL=estimate-dashboard.service.js.map