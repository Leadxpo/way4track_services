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
exports.SubDealerDashboardService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const sub_dealer_repo_1 = require("../sub-dealer/repo/sub-dealer.repo");
let SubDealerDashboardService = class SubDealerDashboardService {
    constructor(subDealerRepository) {
        this.subDealerRepository = subDealerRepository;
    }
    async getSubDealerData(req) {
        const SubDealerData = await this.subDealerRepository.getSubDealerData(req);
        if (!SubDealerData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", SubDealerData);
        }
    }
    async getDetailSubDealerData(req) {
        const SubDealerData = await this.subDealerRepository.getDetailSubDealerData(req);
        if (!SubDealerData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", SubDealerData);
        }
    }
};
exports.SubDealerDashboardService = SubDealerDashboardService;
exports.SubDealerDashboardService = SubDealerDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sub_dealer_repo_1.SubDealerRepository])
], SubDealerDashboardService);
//# sourceMappingURL=sub-dealer-dashboard-service.js.map