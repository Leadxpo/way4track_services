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
exports.VendorController = void 0;
const common_1 = require("@nestjs/common");
const vendor_service_1 = require("./vendor.service");
const vendor_dto_1 = require("./dto/vendor.dto");
const vendor_id_dto_1 = require("./dto/vendor-id.dto");
const common_response_1 = require("../models/common-response");
const platform_express_1 = require("@nestjs/platform-express");
let VendorController = class VendorController {
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    async handleVendorDetails(dto) {
        try {
            return await this.vendorService.handleVendorDetails(dto);
        }
        catch (error) {
            console.error('Error in save vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving vendor details');
        }
    }
    async deleteVendorDetails(dto) {
        try {
            return await this.vendorService.deleteVendorDetails(dto);
        }
        catch (error) {
            console.error('Error in delete vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
    async getVendorDetails(req) {
        try {
            return await this.vendorService.getVendorDetails(req);
        }
        catch (error) {
            console.error('Error in get vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching vendor details');
        }
    }
    async getVendorNamesDropDown() {
        try {
            return this.vendorService.getVendorNamesDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async uploadPhoto(vendorId, photo) {
        try {
            return await this.vendorService.uploadVendorPhoto(vendorId, photo);
        }
        catch (error) {
            console.error('Error uploading vendor photo:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error uploading photo');
        }
    }
};
exports.VendorController = VendorController;
__decorate([
    (0, common_1.Post)('handleVendorDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendor_dto_1.VendorDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "handleVendorDetails", null);
__decorate([
    (0, common_1.Post)('deleteVendorDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendor_id_dto_1.VendorIdDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "deleteVendorDetails", null);
__decorate([
    (0, common_1.Post)('getVendorDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendor_id_dto_1.VendorIdDto]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getVendorDetails", null);
__decorate([
    (0, common_1.Post)('getVendorNamesDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "getVendorNamesDropDown", null);
__decorate([
    (0, common_1.Post)('uploadPhoto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Body)('vendorId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], VendorController.prototype, "uploadPhoto", null);
exports.VendorController = VendorController = __decorate([
    (0, common_1.Controller)('vendor'),
    __metadata("design:paramtypes", [vendor_service_1.VendorService])
], VendorController);
//# sourceMappingURL=vendor.controller.js.map