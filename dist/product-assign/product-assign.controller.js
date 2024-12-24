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
exports.ProductAssignController = void 0;
const common_1 = require("@nestjs/common");
const product_assign_dto_1 = require("./dto/product-assign.dto");
const common_response_1 = require("../models/common-response");
const product_assign_id_dto_1 = require("./dto/product-assign-id.dto");
const product_assign_service_1 = require("./product-assign.service");
const platform_express_1 = require("@nestjs/platform-express");
let ProductAssignController = class ProductAssignController {
    constructor(productAssignService) {
        this.productAssignService = productAssignService;
    }
    async saveProductAssign(dto) {
        try {
            return await this.productAssignService.saveProductAssign(dto);
        }
        catch (error) {
            console.error('Error in save product assignment in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving product assignment');
        }
    }
    async deleteProductAssign(dto) {
        try {
            return await this.productAssignService.deleteProductAssign(dto);
        }
        catch (error) {
            console.error('Error in delete product assignment in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting product assignment');
        }
    }
    async getProductAssign(req) {
        try {
            return await this.productAssignService.getProductAssign(req);
        }
        catch (error) {
            console.error('Error in get product assignment in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching product assignment');
        }
    }
    async assignProduct(assignData) {
        try {
            return await this.productAssignService.assignProduct(assignData);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async markInHands(productAssignId, companyCode, unitCode) {
        try {
            return await this.productAssignService.markInHands(productAssignId, companyCode, unitCode);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async uploadPhoto(productAssignId, photo) {
        try {
            return await this.productAssignService.uploadproductAssignPhoto(productAssignId, photo);
        }
        catch (error) {
            console.error('Error uploading staff photo:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error uploading photo');
        }
    }
};
exports.ProductAssignController = ProductAssignController;
__decorate([
    (0, common_1.Post)('saveProductAssign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_assign_dto_1.ProductAssignDto]),
    __metadata("design:returntype", Promise)
], ProductAssignController.prototype, "saveProductAssign", null);
__decorate([
    (0, common_1.Post)('deleteProductAssign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_assign_id_dto_1.ProductAssignIdDto]),
    __metadata("design:returntype", Promise)
], ProductAssignController.prototype, "deleteProductAssign", null);
__decorate([
    (0, common_1.Post)('getProductAssign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_assign_id_dto_1.ProductAssignIdDto]),
    __metadata("design:returntype", Promise)
], ProductAssignController.prototype, "getProductAssign", null);
__decorate([
    (0, common_1.Post)('assignProduct'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductAssignController.prototype, "assignProduct", null);
__decorate([
    (0, common_1.Post)('markInHands'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], ProductAssignController.prototype, "markInHands", null);
__decorate([
    (0, common_1.Post)('uploadPhoto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Body)('productAssignId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductAssignController.prototype, "uploadPhoto", null);
exports.ProductAssignController = ProductAssignController = __decorate([
    (0, common_1.Controller)('product-assign'),
    __metadata("design:paramtypes", [product_assign_service_1.ProductAssignService])
], ProductAssignController);
//# sourceMappingURL=product-assign.controller.js.map