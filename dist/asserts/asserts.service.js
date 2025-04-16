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
exports.AssertsService = void 0;
const storage_1 = require("@google-cloud/storage");
const common_1 = require("@nestjs/common");
const branch_repo_1 = require("../branch/repo/branch.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const voucher_repo_1 = require("../voucher/repo/voucher.repo");
const asserts_adapter_1 = require("./asserts.adapter");
const asserts_repo_1 = require("./repo/asserts.repo");
let AssertsService = class AssertsService {
    constructor(adapter, assertsRepository, voucherRepo, branchRepo) {
        this.adapter = adapter;
        this.assertsRepository = assertsRepository;
        this.voucherRepo = voucherRepo;
        this.branchRepo = branchRepo;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async getAssertDetails(req) {
        try {
            const assert = await this.assertsRepository.findOne({
                relations: ['branchId'],
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
            });
            if (!assert) {
                return new common_response_1.CommonResponse(false, 404, 'Assert not found');
            }
            const data = this.adapter.convertEntityToDto(assert);
            return new common_response_1.CommonResponse(true, 6541, 'Data Retrieved Successfully', data);
        }
        catch (error) {
            console.error('Error in getAssertDetails service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching assert details');
        }
    }
    async getAllAssertDetails(req) {
        try {
            const assert = await this.assertsRepository.find({
                relations: ['branchId'],
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
            });
            if (!assert) {
                return new common_response_1.CommonResponse(false, 404, 'Assert not found');
            }
            return new common_response_1.CommonResponse(true, 6541, 'Data Retrieved Successfully', assert);
        }
        catch (error) {
            console.error('Error in getAssertDetails service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching assert details');
        }
    }
    async create(createAssertsDto, photo) {
        try {
            console.log(createAssertsDto, "+========");
            let entity = null;
            if (createAssertsDto.id) {
                entity = await this.assertsRepository.findOneBy({ id: createAssertsDto.id });
                if (!entity) {
                    throw new error_response_1.ErrorResponse(404, 'Asset not found');
                }
                const { branchId, ...rest } = createAssertsDto;
                entity = this.assertsRepository.merge(entity, rest);
                if (branchId) {
                    const branchEntity = await this.branchRepo.findOne({ where: { id: branchId } });
                    if (!branchEntity) {
                        throw new Error(`Branch with ID ${branchId} not found`);
                    }
                    entity.branchId = branchEntity;
                }
                if (photo && entity.assetPhoto) {
                    const existingFilePath = entity.assetPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFilePath);
                    try {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFilePath}`);
                    }
                    catch (error) {
                        console.error(`Error deleting old file from GCS: ${error.message}`);
                    }
                }
            }
            else {
                entity = await this.adapter.convertDtoToEntity(createAssertsDto);
            }
            let filePath = null;
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `assert_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);
                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });
                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
                entity.assetPhoto = filePath;
            }
            await this.assertsRepository.save(entity);
            const message = createAssertsDto.id
                ? 'Assert Details Updated Successfully'
                : 'Assert Details Created Successfully';
            return new common_response_1.CommonResponse(true, 200, message, { photoPath: filePath });
        }
        catch (error) {
            console.error('Error saving asset details:', error);
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async deleteAssertDetails(dto) {
        try {
            console.log(dto, "++++");
            const assertExists = await this.assertsRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            console.log(assertExists, "++++");
            if (!assertExists) {
                throw new error_response_1.ErrorResponse(404, `assert with ID ${dto.id} does not exist`);
            }
            await this.assertsRepository.delete(dto.id);
            return new common_response_1.CommonResponse(true, 65153, 'assert Details Deleted Successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5417, error.message);
        }
    }
};
exports.AssertsService = AssertsService;
exports.AssertsService = AssertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [asserts_adapter_1.AssertsAdapter,
        asserts_repo_1.AssertsRepository,
        voucher_repo_1.VoucherRepository,
        branch_repo_1.BranchRepository])
], AssertsService);
//# sourceMappingURL=asserts.service.js.map