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
exports.EstimateController = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
const common_req_1 = require("../models/common-req");
const common_response_1 = require("../models/common-response");
const estimate_id_dto_1 = require("./dto/estimate-id.dto");
const estimate_dto_1 = require("./dto/estimate.dto");
const estimate_service_1 = require("./estimate.service");
const platform_express_1 = require("@nestjs/platform-express");
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
let EstimateController = class EstimateController {
    constructor(estimateService) {
        this.estimateService = estimateService;
    }
    async handleEstimateDetails(dto, files) {
        if (dto.id) {
            dto.id = Number(dto.id);
        }
        try {
            return await this.estimateService.uploadAndHandleEstimateDetails(dto, files);
        }
        catch (error) {
            console.error('Error in handleEstimateDetails:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error handling estimate details');
        }
    }
    async deleteEstimateDetails(dto) {
        try {
            return await this.estimateService.deleteEstimateDetails(dto);
        }
        catch (error) {
            console.error('Error in delete estimate details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting estimate details');
        }
    }
    async getEstimateDetails(req) {
        try {
            return await this.estimateService.getEstimateDetails(req);
        }
        catch (error) {
            console.error('Error in get estimate details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching estimate details');
        }
    }
    async getAllEstimateDetails(req) {
        try {
            return await this.estimateService.getAllEstimateDetails(req);
        }
        catch (error) {
            console.error('Error in get estimate details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching estimate details');
        }
    }
};
exports.EstimateController = EstimateController;
__decorate([
    (0, common_1.Post)('handleEstimateDetails'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'estimatePdf', maxCount: 1 },
        { name: 'invoicePDF', maxCount: 1 }
    ], multerOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_dto_1.EstimateDto, Object]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "handleEstimateDetails", null);
__decorate([
    (0, common_1.Post)('deleteEstimateDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_id_dto_1.EstimateIdDto]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "deleteEstimateDetails", null);
__decorate([
    (0, common_1.Post)('getEstimateDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_id_dto_1.EstimateIdDto]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "getEstimateDetails", null);
__decorate([
    (0, common_1.Post)('getAllEstimateDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "getAllEstimateDetails", null);
exports.EstimateController = EstimateController = __decorate([
    (0, common_1.Controller)('estimate'),
    __metadata("design:paramtypes", [estimate_service_1.EstimateService])
], EstimateController);
//# sourceMappingURL=estimate.controller.js.map