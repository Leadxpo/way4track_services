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
exports.BranchController = void 0;
const common_1 = require("@nestjs/common");
const branch_service_1 = require("./branch.service");
const branch_dto_1 = require("./dto/branch.dto");
const branch_id_dto_1 = require("./dto/branch-id.dto");
const common_response_1 = require("../models/common-response");
const platform_express_1 = require("@nestjs/platform-express");
let BranchController = class BranchController {
    constructor(branchService) {
        this.branchService = branchService;
    }
    async saveBranchDetails(dto) {
        try {
            return this.branchService.saveBranchDetails(dto);
        }
        catch (error) {
            console.log("Error in create address in services..", error);
        }
    }
    async deleteBranchDetails(dto) {
        try {
            return this.branchService.deleteBranchDetails(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async getBranchDetails(req) {
        try {
            return this.branchService.getBranchDetails(req);
        }
        catch (error) {
            console.log("Error in create address in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async getBranchNamesDropDown() {
        try {
            return this.branchService.getBranchNamesDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async uploadPhoto(branchId, photo) {
        try {
            return await this.branchService.uploadBranchPhoto(branchId, photo);
        }
        catch (error) {
            console.error('Error uploading branch photo:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error uploading photo');
        }
    }
};
exports.BranchController = BranchController;
__decorate([
    (0, common_1.Post)('saveBranchDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [branch_dto_1.BranchDto]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "saveBranchDetails", null);
__decorate([
    (0, common_1.Post)('deleteBranchDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [branch_id_dto_1.BranchIdDto]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "deleteBranchDetails", null);
__decorate([
    (0, common_1.Post)('getBranchDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [branch_id_dto_1.BranchIdDto]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "getBranchDetails", null);
__decorate([
    (0, common_1.Post)('getBranchNamesDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "getBranchNamesDropDown", null);
__decorate([
    (0, common_1.Post)('uploadPhoto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Body)('branchId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "uploadPhoto", null);
exports.BranchController = BranchController = __decorate([
    (0, common_1.Controller)('branch'),
    __metadata("design:paramtypes", [branch_service_1.BranchService])
], BranchController);
//# sourceMappingURL=branch.controller.js.map