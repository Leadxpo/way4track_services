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
const common_req_1 = require("../models/common-req");
const multer = require("multer");
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
let HiringController = class HiringController {
    constructor(hiringService) {
        this.hiringService = hiringService;
    }
    async saveHiringDetailsWithResume(dto, file) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.hiringService.saveHiringDetails(dto, file);
        }
        catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }
    async getCandidatesStatsLast30Days(req) {
        return await this.hiringService.getCandidatesStatsLast30Days(req);
    }
    async getHiringTodayDetails(req) {
        return await this.hiringService.getHiringTodayDetails(req);
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
    async getHiringDetailsById(dto) {
        try {
            return await this.hiringService.getHiringDetailsById(dto);
        }
        catch (error) {
            console.error('Error in get hiring details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching hiring details');
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
    async getHiringSearchDetails(dto) {
        try {
            return await this.hiringService.getHiringSearchDetails(dto);
        }
        catch (error) {
            console.error('Error in get hiring details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching hiring details');
        }
    }
};
exports.HiringController = HiringController;
__decorate([
    (0, common_1.Post)('saveHiringDetailsWithResume'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hiring_dto_1.HiringDto, Object]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "saveHiringDetailsWithResume", null);
__decorate([
    (0, common_1.Post)('getCandidatesStatsLast30Days'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "getCandidatesStatsLast30Days", null);
__decorate([
    (0, common_1.Post)('getHiringTodayDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "getHiringTodayDetails", null);
__decorate([
    (0, common_1.Post)('deleteHiringDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hiring_id_dto_1.HiringIdDto]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "deleteHiringDetails", null);
__decorate([
    (0, common_1.Post)('getHiringDetailsById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hiring_id_dto_1.HiringIdDto]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "getHiringDetailsById", null);
__decorate([
    (0, common_1.Post)('getHiringDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "getHiringDetails", null);
__decorate([
    (0, common_1.Post)('getHiringSearchDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], HiringController.prototype, "getHiringSearchDetails", null);
exports.HiringController = HiringController = __decorate([
    (0, common_1.Controller)('hiring'),
    __metadata("design:paramtypes", [hiring_service_1.HiringService])
], HiringController);
//# sourceMappingURL=hiring.controller.js.map