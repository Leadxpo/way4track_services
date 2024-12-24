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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertDashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asserts_repo_1 = require("../asserts/repo/asserts.repo");
const common_response_1 = require("../models/common-response");
let AssertDashboardService = class AssertDashboardService {
    constructor(assertRepo) {
        this.assertRepo = assertRepo;
    }
    async assertCardData(req) {
        const cardData = await this.assertRepo.assertsCardData(req);
        if (!cardData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", cardData);
        }
    }
};
exports.AssertDashboardService = AssertDashboardService;
exports.AssertDashboardService = AssertDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asserts_repo_1.AssertsRepository)),
    __metadata("design:paramtypes", [asserts_repo_1.AssertsRepository])
], AssertDashboardService);
//# sourceMappingURL=assert-dashboard.service.js.map