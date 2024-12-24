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
const common_1 = require("@nestjs/common");
const asserts_repo_1 = require("./repo/asserts.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const path_1 = require("path");
const fs_1 = require("fs");
const voucher_repo_1 = require("../voucher/repo/voucher.repo");
const asserts_adapter_1 = require("./asserts.adapter");
const branch_repo_1 = require("../branch/repo/branch.repo");
let AssertsService = class AssertsService {
    constructor(adapter, assertsRepository, voucherRepo, branchRepo) {
        this.adapter = adapter;
        this.assertsRepository = assertsRepository;
        this.voucherRepo = voucherRepo;
        this.branchRepo = branchRepo;
    }
    async getAssertDetails(req) {
        try {
            const assert = await this.assertsRepository.findOne({
                relations: ['branchId', 'voucherId'],
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
    async create(createAssertsDto) {
        try {
            const branchEntity = await this.branchRepo.findOne({ where: { id: createAssertsDto.branchId } });
            if (!branchEntity) {
                throw new Error('Branch not found');
            }
            const voucher = await this.voucherRepo.findOne({
                where: { id: createAssertsDto.voucherId }
            });
            if (!voucher) {
                throw new Error('Voucher not found');
            }
            const entity = this.adapter.convertDtoToEntity(createAssertsDto);
            await this.assertsRepository.save(entity);
            const message = createAssertsDto.id
                ? 'Assert Details Updated Successfully'
                : 'Assert Details Created Successfully';
            return new common_response_1.CommonResponse(true, 65152, message);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5416, error.message);
        }
    }
    async deleteAssertDetails(dto) {
        try {
            const assertExists = await this.assertsRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
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
    async uploadAssertPhoto(assertId, photo) {
        try {
            const assert = await this.assertsRepository.findOne({ where: { id: assertId } });
            if (!assert) {
                return new common_response_1.CommonResponse(false, 404, 'assert not found');
            }
            const filePath = (0, path_1.join)(__dirname, '../../uploads/assert_photos', `${assertId}-${Date.now()}.jpg`);
            await fs_1.promises.writeFile(filePath, photo.buffer);
            assert.assetPhoto = filePath;
            await this.assertsRepository.save(assert);
            return new common_response_1.CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
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