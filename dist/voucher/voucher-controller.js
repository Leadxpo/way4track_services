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
exports.VoucherController = void 0;
const common_1 = require("@nestjs/common");
const voucher_dto_1 = require("./dto/voucher.dto");
const common_response_1 = require("../models/common-response");
const voucher_service_1 = require("./voucher-service");
const multer = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
let VoucherController = class VoucherController {
    constructor(voucherService) {
        this.voucherService = voucherService;
    }
    async saveVoucher(dto, file) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            const savedVoucher = await this.voucherService.handleVoucher(dto, file);
            return new common_response_1.CommonResponse(true, 200, 'Voucher saved successfully', savedVoucher);
        }
        catch (error) {
            console.error('Error in save voucher details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving voucher details', error.message);
        }
    }
    async deleteVoucher(dto) {
        try {
            return await this.voucherService.deleteVoucherDetails(dto);
        }
        catch (error) {
            console.error('Error in delete voucher details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting voucher details', error.message);
        }
    }
    async getPendingVouchers(dto) {
        try {
            return await this.voucherService.getPendingVouchers(dto);
        }
        catch (error) {
            console.error('Error in delete voucher details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting voucher details', error.message);
        }
    }
    async getAllVouchers() {
        try {
            const vouchers = await this.voucherService.getAllVouchers();
            return new common_response_1.CommonResponse(true, 200, 'Vouchers fetched successfully', vouchers);
        }
        catch (error) {
            console.error('Error in get all voucher details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching vouchers', error.message);
        }
    }
    async getVoucherNamesDropDown() {
        try {
            return this.voucherService.getVoucherNamesDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
};
exports.VoucherController = VoucherController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    (0, common_1.Post)('saveVoucher'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [voucher_dto_1.VoucherDto, Object]),
    __metadata("design:returntype", Promise)
], VoucherController.prototype, "saveVoucher", null);
__decorate([
    (0, common_1.Post)('deleteVoucher'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VoucherController.prototype, "deleteVoucher", null);
__decorate([
    (0, common_1.Post)('getPendingVouchers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VoucherController.prototype, "getPendingVouchers", null);
__decorate([
    (0, common_1.Post)('getAllVouchers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoucherController.prototype, "getAllVouchers", null);
__decorate([
    (0, common_1.Post)('getVoucherNamesDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoucherController.prototype, "getVoucherNamesDropDown", null);
exports.VoucherController = VoucherController = __decorate([
    (0, common_1.Controller)('voucher'),
    __metadata("design:paramtypes", [voucher_service_1.VoucherService])
], VoucherController);
//# sourceMappingURL=voucher-controller.js.map