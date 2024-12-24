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
exports.VendorDashboardService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const vendor_repo_1 = require("../vendor/repo/vendor.repo");
let VendorDashboardService = class VendorDashboardService {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    async getVendorData(req) {
        const VendorData = await this.vendorRepository.getVendorData(req);
        if (!VendorData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VendorData);
        }
    }
    async getDetailVendorData(req) {
        const VendorData = await this.vendorRepository.getDetailvendorData(req);
        if (!VendorData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VendorData);
        }
    }
};
exports.VendorDashboardService = VendorDashboardService;
exports.VendorDashboardService = VendorDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vendor_repo_1.VendorRepository])
], VendorDashboardService);
//# sourceMappingURL=vendor-dashboard.service.js.map