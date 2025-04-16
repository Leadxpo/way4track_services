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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const platform_express_1 = require("@nestjs/platform-express");
const common_response_1 = require("../models/common-response");
const product_dto_1 = require("./dto/product.dto");
const product_id_dto_1 = require("./dto/product.id.dto");
const common_req_1 = require("../models/common-req");
const multer = require("multer");
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async bulkUpload(file, productDto) {
        try {
            if (productDto.id) {
                productDto.id = Number(productDto.id);
            }
            return await this.productService.createOrUpdateProduct(productDto, file);
        }
        catch (error) {
            console.error('Error processing file and form data:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error processing file and form data');
        }
    }
    async deleteProductDetails(dto) {
        try {
            return await this.productService.deleteProductDetails(dto);
        }
        catch (error) {
            console.error('Error in delete client details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting client details');
        }
    }
    async getproductDetails(req) {
        try {
            return await this.productService.getproductDetails(req);
        }
        catch (error) {
            console.error('Error in get client details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching client details');
        }
    }
    async getAllproductDetails(req) {
        try {
            return await this.productService.getAllproductDetails(req);
        }
        catch (error) {
            console.error('Error in get client details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching client details');
        }
    }
    async getSearchDetailProduct(req) {
        try {
            return await this.productService.getSearchDetailProduct(req);
        }
        catch (error) {
            console.error('Error in get client details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching client details');
        }
    }
    async getProductNamesDropDown() {
        try {
            return this.productService.getProductNamesDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async getDetailProduct(req) {
        try {
            return this.productService.getDetailProduct(req);
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async productAssignDetails(req) {
        try {
            return this.productService.productAssignDetails(req);
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)('bulk-upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, product_dto_1.ProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "bulkUpload", null);
__decorate([
    (0, common_1.Post)('deleteProductDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_id_dto_1.ProductIdDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProductDetails", null);
__decorate([
    (0, common_1.Post)('getproductDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_id_dto_1.ProductIdDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getproductDetails", null);
__decorate([
    (0, common_1.Post)('getAllproductDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllproductDetails", null);
__decorate([
    (0, common_1.Post)('getSearchDetailProduct'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_id_dto_1.ProductIdDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getSearchDetailProduct", null);
__decorate([
    (0, common_1.Post)('getProductNamesDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductNamesDropDown", null);
__decorate([
    (0, common_1.Post)('getDetailProduct'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getDetailProduct", null);
__decorate([
    (0, common_1.Post)('productAssignDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "productAssignDetails", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map