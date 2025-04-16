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
exports.SubDealerService = void 0;
const storage_1 = require("@google-cloud/storage");
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const sub_dealer_repo_1 = require("./repo/sub-dealer.repo");
const sub_dealer_adapter_1 = require("./sub-dealer.adapter");
let SubDealerService = class SubDealerService {
    constructor(subDealerAdapter, subDealerRepository) {
        this.subDealerAdapter = subDealerAdapter;
        this.subDealerRepository = subDealerRepository;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    generateSubDealerId(sequenceNumber) {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `SD-${paddedNumber}`;
    }
    async updateSubDealerDetails(dto, filePath) {
        try {
            let existingSubDealer = null;
            if (dto.id) {
                existingSubDealer = await this.subDealerRepository.findOne({
                    where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
                });
            }
            else if (dto.subDealerId) {
                existingSubDealer = await this.subDealerRepository.findOne({
                    where: { subDealerId: dto.subDealerId, companyCode: dto.companyCode, unitCode: dto.unitCode }
                });
            }
            if (!existingSubDealer) {
                return new common_response_1.CommonResponse(false, 4002, 'SubDealer not found for the provided ID.');
            }
            if (filePath && existingSubDealer.subDealerPhoto) {
                const existingFilePath = existingSubDealer.subDealerPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                const file = this.storage.bucket(this.bucketName).file(existingFilePath);
                try {
                    await file.delete();
                    console.log(`Deleted old file from GCS: ${existingFilePath}`);
                }
                catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }
            Object.assign(existingSubDealer, this.subDealerAdapter.convertDtoToEntity(dto));
            await this.subDealerRepository.save(existingSubDealer);
            return new common_response_1.CommonResponse(true, 200, 'SubDealer details updated successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, `Failed to update subdealer details: ${error.message}`);
        }
    }
    async createSubDealerDetails(dto, filePath) {
        try {
            const entity = this.subDealerAdapter.convertDtoToEntity(dto);
            if (!entity.subDealerId) {
                const allocationCount = await this.subDealerRepository.count({});
                entity.subDealerId = this.generateSubDealerId(allocationCount + 1);
            }
            if (filePath) {
                entity.subDealerPhoto = filePath;
            }
            await this.subDealerRepository.insert(entity);
            return new common_response_1.CommonResponse(true, 201, 'SubDealer details created successfully');
        }
        catch (error) {
            console.log(error);
            throw new error_response_1.ErrorResponse(500, `Failed to create subdealer details: ${error.message}`);
        }
    }
    async handleSubDealerDetails(dto, photo) {
        try {
            let filePath = null;
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `subDealer_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);
                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });
                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }
            if (dto.id && dto.id !== null || (dto.subDealerId && dto.subDealerId.trim() !== '')) {
                return await this.updateSubDealerDetails(dto, filePath);
            }
            else {
                return await this.createSubDealerDetails(dto, filePath);
            }
        }
        catch (error) {
            console.error(`Error handling staff details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to handle staff details: ${error.message}`);
        }
    }
    async deleteSubDealerDetails(dto) {
        try {
            const subDealer = await this.subDealerRepository.findOne({ where: { subDealerId: dto.subDealerId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!subDealer) {
                return new common_response_1.CommonResponse(false, 404, 'SubDealer not found');
            }
            await this.subDealerRepository.delete(dto.subDealerId);
            return new common_response_1.CommonResponse(true, 200, 'SubDealer details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getSubDealerDetails(req) {
        try {
            const subDealer = await this.subDealerRepository.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch'] });
            if (!subDealer) {
                return new common_response_1.CommonResponse(false, 404, 'SubDealer not found');
            }
            const resDto = this.subDealerAdapter.convertEntityToDto(subDealer);
            return new common_response_1.CommonResponse(true, 200, 'SubDealer details fetched successfully', resDto);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getSubDealerDetailById(req) {
        try {
            const subDealer = await this.subDealerRepository.findOne({ where: { subDealerId: req.subDealerId, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch'] });
            if (!subDealer) {
                return new common_response_1.CommonResponse(false, 404, 'SubDealer not found');
            }
            const resDto = this.subDealerAdapter.convertEntityToDto([subDealer])[0];
            return new common_response_1.CommonResponse(true, 200, 'SubDealer details fetched successfully', resDto);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getSubDealerNamesDropDown() {
        const data = await this.subDealerRepository.find({ select: ['name', 'id', 'subDealerId'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No branch names");
        }
    }
    async getSubDealerProfileDetails(req) {
        try {
            const subDealer = await this.subDealerRepository.find({ where: { subDealerId: req.staffId, password: req.password, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch', 'permissions'] });
            if (!subDealer) {
                return new common_response_1.CommonResponse(false, 404, 'SubDealer not found');
            }
            const resDto = this.subDealerAdapter.convertEntityToDto(subDealer);
            return new common_response_1.CommonResponse(true, 200, 'SubDealer details fetched successfully', resDto);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.SubDealerService = SubDealerService;
exports.SubDealerService = SubDealerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sub_dealer_adapter_1.SubDealerAdapter,
        sub_dealer_repo_1.SubDealerRepository])
], SubDealerService);
//# sourceMappingURL=sub-dealer.service.js.map