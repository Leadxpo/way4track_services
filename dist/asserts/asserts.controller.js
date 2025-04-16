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
const platform_express_1 = require("@nestjs/platform-express");
const common_req_1 = require("../models/common-req");
const common_response_1 = require("../models/common-response");
const asserts_service_1 = require("./asserts.service");
const asserts_id_dto_1 = require("./dto/asserts-id.dto");
const asserts_dto_1 = require("./dto/asserts.dto");
const multer = require("multer");
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
let AssertsController = class AssertsController {
    constructor(assertsService) {
        this.assertsService = assertsService;
    }
    async createAssert(createAssertsDto, photo) {
        if (createAssertsDto.id) {
            createAssertsDto.id = Number(createAssertsDto.id);
        }
        return this.assertsService.create(createAssertsDto, photo);
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
    async getAllAssertDetails(req) {
        try {
            return this.assertsService.getAllAssertDetails(req);
        }
        catch (error) {
            console.log("Error in get assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching assert details');
        }
    }
};
exports.AssertsController = AssertsController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', multerOptions)),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asserts_dto_1.AssertsDto, Object]),
    __metadata("design:returntype", Promise)
], AssertsController.prototype, "createAssert", null);
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
    (0, common_1.Post)('getAllAssertDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], AssertsController.prototype, "getAllAssertDetails", null);
exports.AssertsController = AssertsController = __decorate([
    (0, common_1.Controller)('asserts'),
    __metadata("design:paramtypes", [asserts_service_1.AssertsService])
], AssertsController);
//# sourceMappingURL=asserts.controller.js.map