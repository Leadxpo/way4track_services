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
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const vendor_adapter_1 = require("./vendor.adapter");
const vendor_repo_1 = require("./repo/vendor.repo");
const path_1 = require("path");
const fs_1 = require("fs");
let VendorService = class VendorService {
    constructor(vendorAdapter, vendorRepository) {
        this.vendorAdapter = vendorAdapter;
        this.vendorRepository = vendorRepository;
    }
    generateVendorId(sequenceNumber) {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `v-${paddedNumber}`;
    }
    async updateVendorDetails(dto) {
        try {
            const existingVendor = await this.vendorRepository.findOne({
                where: { id: dto.id, vendorId: dto.vendorId, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });
            if (!existingVendor) {
                return new common_response_1.CommonResponse(false, 4002, 'Vendor not found for the provided ID.');
            }
            Object.assign(existingVendor, this.vendorAdapter.convertDtoToEntity(dto));
            await this.vendorRepository.save(existingVendor);
            return new common_response_1.CommonResponse(true, 200, 'Vendor details updated successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, `Failed to update vendor details: ${error.message}`);
        }
    }
    async createVendorDetails(dto) {
        try {
            const entity = this.vendorAdapter.convertDtoToEntity(dto);
            if (!entity.vendorId) {
                const allocationCount = await this.vendorRepository.count({});
                entity.vendorId = this.generateVendorId(allocationCount + 1);
            }
            await this.vendorRepository.save(entity);
            return new common_response_1.CommonResponse(true, 201, 'Vendor details created successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, `Failed to create vendor details: ${error.message}`);
        }
    }
    async handleVendorDetails(dto) {
        if (dto.id || dto.vendorId) {
            return await this.updateVendorDetails(dto);
        }
        else {
            return await this.createVendorDetails(dto);
        }
    }
    async deleteVendorDetails(dto) {
        try {
            const vendor = await this.vendorRepository.findOne({ where: { vendorId: dto.vendorId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!vendor) {
                return new common_response_1.CommonResponse(false, 404, 'Vendor not found');
            }
            await this.vendorRepository.delete(dto.vendorId);
            return new common_response_1.CommonResponse(true, 200, 'Vendor details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getVendorDetails(req) {
        try {
            const vendor = await this.vendorRepository.findOne({
                where: { vendorId: req.vendorId, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['voucherId'],
            });
            if (!vendor) {
                return new common_response_1.CommonResponse(false, 404, 'Vendor not found');
            }
            const vendorResDto = this.vendorAdapter.convertEntityToDto([vendor])[0];
            return new common_response_1.CommonResponse(true, 200, 'Vendor details fetched successfully', vendorResDto);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getVendorNamesDropDown() {
        const data = await this.vendorRepository.find({ select: ['name', 'id', 'vendorId'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No branch names");
        }
    }
    async uploadVendorPhoto(vendorId, photo) {
        try {
            const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
            if (!vendor) {
                return new common_response_1.CommonResponse(false, 404, 'vendor not found');
            }
            const filePath = (0, path_1.join)(__dirname, '../../uploads/vendor_photos', `${vendorId}-${Date.now()}.jpg`);
            await fs_1.promises.writeFile(filePath, photo.buffer);
            vendor.vendorPhoto = filePath;
            await this.vendorRepository.save(vendor);
            return new common_response_1.CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vendor_adapter_1.VendorAdapter,
        vendor_repo_1.VendorRepository])
], VendorService);
//# sourceMappingURL=vendor.service.js.map