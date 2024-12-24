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
exports.AssertsController = void 0;
const common_1 = require("@nestjs/common");
const asserts_dto_1 = require("./dto/asserts.dto");
const asserts_id_dto_1 = require("./dto/asserts-id.dto");
const asserts_service_1 = require("./asserts.service");
const common_response_1 = require("../models/common-response");
const platform_express_1 = require("@nestjs/platform-express");
let AssertsController = class AssertsController {
    constructor(assertsService) {
        this.assertsService = assertsService;
    }
    async saveAssertDetails(dto) {
        try {
            return this.assertsService.create(dto);
        }
        catch (error) {
            console.log("Error in save assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving assert details');
        }
    }
    async deleteAssertDetails(dto) {
        try {
            return this.assertsService.deleteAssertDetails(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async getAssertDetails(req) {
        try {
            return this.assertsService.getAssertDetails(req);
        }
        catch (error) {
            console.log("Error in get assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching assert details');
        }
    }
    async uploadPhoto(assertId, photo) {
        try {
            return await this.assertsService.uploadAssertPhoto(assertId, photo);
        }
        catch (error) {
            console.error('Error uploading assert photo:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error uploading photo');
        }
    }
};
exports.AssertsController = AssertsController;
__decorate([
    (0, common_1.Post)('saveAssertDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asserts_dto_1.AssertsDto]),
    __metadata("design:returntype", Promise)
], AssertsController.prototype, "saveAssertDetails", null);
__decorate([
    (0, common_1.Post)('deleteAssertDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asserts_id_dto_1.AssertsIdDto]),
    __metadata("design:returntype", Promise)
], AssertsController.prototype, "deleteAssertDetails", null);
__decorate([
    (0, common_1.Post)('getAssertDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asserts_id_dto_1.AssertsIdDto]),
    __metadata("design:returntype", Promise)
], AssertsController.prototype, "getAssertDetails", null);
__decorate([
    (0, common_1.Post)('uploadPhoto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Body)('assertId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssertsController.prototype, "uploadPhoto", null);
exports.AssertsController = AssertsController = __decorate([
    (0, common_1.Controller)('asserts'),
    __metadata("design:paramtypes", [asserts_service_1.AssertsService])
], AssertsController);
//# sourceMappingURL=asserts.controller.js.map