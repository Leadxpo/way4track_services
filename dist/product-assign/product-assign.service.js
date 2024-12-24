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
exports.ProductAssignService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const product_assign_adapter_1 = require("./product-assign.adapter");
const product_assign_repo_1 = require("./repo/product-assign.repo");
const error_response_1 = require("../models/error-response");
const product_assign_res_dto_1 = require("./dto/product-assign-res.dto");
const path_1 = require("path");
const fs_1 = require("fs");
let ProductAssignService = class ProductAssignService {
    constructor(productAssignRepository, productAssignAdapter) {
        this.productAssignRepository = productAssignRepository;
        this.productAssignAdapter = productAssignAdapter;
    }
    async saveProductAssign(dto) {
        try {
            const internalMessage = dto.id
                ? 'Product assignment updated successfully'
                : 'Product assignment created successfully';
            const entity = this.productAssignAdapter.convertDtoToEntity(dto);
            await this.productAssignRepository.save(entity);
            return new common_response_1.CommonResponse(true, 200, internalMessage);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getProductAssign(dto) {
        try {
            const productAssign = await this.productAssignRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['branchId', 'staffId', 'productId'],
            });
            if (!productAssign) {
                throw new Error('Product assignment not found');
            }
            const responseDto = new product_assign_res_dto_1.ProductAssignResDto(productAssign.id, productAssign.staffId.id.toString(), productAssign.staffId.name, productAssign.branchId.id, productAssign.branchId.branchName, productAssign.productId.productName, productAssign.productId.categoryName, productAssign.imeiNumberFrom, productAssign.imeiNumberTo, productAssign.numberOfProducts, productAssign.productAssignPhoto, productAssign.companyCode, productAssign.unitCode);
            return new common_response_1.CommonResponse(true, 200, 'Product assignment fetched successfully', responseDto);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async deleteProductAssign(dto) {
        try {
            const productAssign = await this.productAssignRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!productAssign) {
                throw new Error('Product assignment not found');
            }
            await this.productAssignRepository.remove(productAssign);
            return new common_response_1.CommonResponse(true, 200, 'Product assignment deleted successfully');
        }
        catch (error) {
            console.error('Error in delete product assignment', error);
            throw new Error('Error deleting product assignment');
        }
    }
    async assignProduct(assignData) {
        const { productId, staffId, assignedQty, productType, assignTo, companyCode, unitCode } = assignData;
        const productAssign = await this.productAssignRepository.findOne({ where: { productId } });
        if (!productAssign) {
            throw new Error('Product assignment not found');
        }
        if (productAssign.numberOfProducts < assignedQty) {
            throw new Error('Not enough products to assign');
        }
        productAssign.isAssign = true;
        productAssign.assignedQty = assignedQty;
        productAssign.companyCode = companyCode;
        productAssign.unitCode = unitCode;
        productAssign.assignTime = new Date();
        productAssign.assignTo = assignTo;
        productAssign.productType = productType;
        productAssign.inHands = false;
        productAssign.numberOfProducts -= assignedQty;
        await this.productAssignRepository.save(productAssign);
        return productAssign;
    }
    async markInHands(productAssignId, companyCode, unitCode) {
        const productAssign = await this.productAssignRepository.findOne({ where: { id: productAssignId, companyCode: companyCode, unitCode: unitCode } });
        if (!productAssign) {
            throw new Error('Product assignment not found');
        }
        productAssign.inHands = true;
        await this.productAssignRepository.save(productAssign);
        return productAssign;
    }
    async uploadproductAssignPhoto(productAssignId, photo) {
        try {
            const productAssign = await this.productAssignRepository.findOne({ where: { id: productAssignId } });
            if (!productAssign) {
                return new common_response_1.CommonResponse(false, 404, 'productAssign not found');
            }
            const filePath = (0, path_1.join)(__dirname, '../../uploads/productAssign_photos', `${productAssignId}-${Date.now()}.jpg`);
            await fs_1.promises.writeFile(filePath, photo.buffer);
            productAssign.productAssignPhoto = filePath;
            await this.productAssignRepository.save(productAssign);
            return new common_response_1.CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.ProductAssignService = ProductAssignService;
exports.ProductAssignService = ProductAssignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_assign_repo_1.ProductAssignRepository,
        product_assign_adapter_1.ProductAssignAdapter])
], ProductAssignService);
//# sourceMappingURL=product-assign.service.js.map