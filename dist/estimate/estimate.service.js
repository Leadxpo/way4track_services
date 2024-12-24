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
exports.EstimateService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const estimate_adapter_1 = require("./estimate.adapter");
const estimate_repo_1 = require("./repo/estimate.repo");
const client_repo_1 = require("../client/repo/client.repo");
let EstimateService = class EstimateService {
    constructor(estimateAdapter, estimateRepository, clientRepository) {
        this.estimateAdapter = estimateAdapter;
        this.estimateRepository = estimateRepository;
        this.clientRepository = clientRepository;
    }
    async updateEstimateDetails(dto) {
        try {
            const existingEstimate = await this.estimateRepository.findOne({
                where: { id: dto.id },
            });
            if (!existingEstimate) {
                return new common_response_1.CommonResponse(false, 404, `Estimate with ID ${dto.id} not found`);
            }
            const client = await this.clientRepository.findOne({
                where: { clientId: dto.clientId },
            });
            if (!client) {
                return new common_response_1.CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }
            Object.assign(existingEstimate, this.estimateAdapter.convertDtoToEntity(dto));
            existingEstimate.clientId = client;
            await this.estimateRepository.save(existingEstimate);
            return new common_response_1.CommonResponse(true, 200, 'Estimate details updated successfully');
        }
        catch (error) {
            console.error(`Error updating estimate details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to update estimate details: ${error.message}`);
        }
    }
    async createEstimateDetails(dto) {
        try {
            const client = await this.clientRepository.findOne({
                where: { clientId: dto.clientId },
            });
            if (!client) {
                return new common_response_1.CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }
            const newEstimate = this.estimateAdapter.convertDtoToEntity(dto);
            newEstimate.clientId = client;
            const estimateCount = await this.estimateRepository.count({
                where: { clientId: client },
            });
            newEstimate.estimateId = this.generateEstimateId(estimateCount + 1);
            await this.estimateRepository.save(newEstimate);
            return new common_response_1.CommonResponse(true, 201, 'Estimate details created successfully');
        }
        catch (error) {
            console.error(`Error creating estimate details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to create estimate details: ${error.message}`);
        }
    }
    async handleEstimateDetails(dto) {
        if (dto.id) {
            return await this.updateEstimateDetails(dto);
        }
        else {
            return await this.createEstimateDetails(dto);
        }
    }
    generateEstimateId(sequenceNumber) {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        return `EST-${paddedNumber}`;
    }
    async deleteEstimateDetails(dto) {
        try {
            const estimate = await this.estimateRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!estimate) {
                return new common_response_1.CommonResponse(false, 404, 'Estimate not found');
            }
            await this.estimateRepository.delete(dto.id);
            return new common_response_1.CommonResponse(true, 200, 'Estimate details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getEstimateDetails(req) {
        try {
            const estimate = await this.estimateRepository.findOne({
                relations: ['clientId'],
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }
            });
            if (!estimate) {
                return new common_response_1.CommonResponse(false, 404, 'Estimate not found');
            }
            const data = this.estimateAdapter.convertEntityToResDto(estimate);
            return new common_response_1.CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.EstimateService = EstimateService;
exports.EstimateService = EstimateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [estimate_adapter_1.EstimateAdapter,
        estimate_repo_1.EstimateRepository,
        client_repo_1.ClientRepository])
], EstimateService);
//# sourceMappingURL=estimate.service.js.map