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
exports.HiringController = void 0;
const common_1 = require("@nestjs/common");
const hiring_dto_1 = require("./dto/hiring.dto");
const hiring_service_1 = require("./hiring.service");
const common_response_1 = require("../models/common-response");
const hiring_id_dto_1 = require("./dto/hiring-id.dto");
const platform_express_1 = require("@nestjs/platform-express");
const hiring_filter_dto_1 = require("./dto/hiring-filter.dto");
let HiringController = class HiringController {
    constructor(hiringService) {
        this.hiringService = hiringService;
    }
    async saveHiringDetails(dto) {
        try {
            return await this.hiringService.saveHiringDetails(dto);
        }
        catch (error) {
            console.error('Error in save hiring details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving hiring details');
        }
    }
    async deleteHiringDetails(dto) {
        try {
            return await this.hiringService.deleteHiringDetails(dto);
        }
        catch (error) {
            console.error('Error in delete hiring details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting hiring details');
        }
    }
    async getHiringDetails(dto) {
        try {
            return await this.hiringService.getHiringDetails(dto);
        }
        catch (error) {
            console.error('Error in get hiring details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching hiring details');
        }
    }
    async uploadResume(hiringId, file) {
        try {
            return await this.hiringService.uploadResume(hiringId, file);
        }
        catch (error) {
            console.error('Error in upload resume in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error uploading resume');
        }
    }
    async getHiringSearchDetails(req) {
        return this.hiringService.getHiringSearchDetails(req);
    }
};
exports.HiringController = HiringController;
__decorate([
    (0, common_1.Post)('saveHiringDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hiring_dto_1.HiringDto]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "saveHiringDetails", null);
__decorate([
    (0, common_1.Post)('deleteHiringDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hiring_id_dto_1.HiringIdDto]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "deleteHiringDetails", null);
__decorate([
    (0, common_1.Post)('getHiringDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hiring_id_dto_1.HiringIdDto]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "getHiringDetails", null);
__decorate([
    (0, common_1.Post)('uploadResume'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "uploadResume", null);
__decorate([
    (0, common_1.Post)('getHiringSearchDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hiring_filter_dto_1.HiringFilterDto]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "getHiringSearchDetails", null);
exports.HiringController = HiringController = __decorate([
    (0, common_1.Controller)('hiring'),
    __metadata("design:paramtypes", [hiring_service_1.HiringService])
], HiringController);
//# sourceMappingURL=hiring.controller.js.map