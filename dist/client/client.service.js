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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const client_repo_1 = require("./repo/client.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const client_adapter_1 = require("./client.adapter");
const branch_repo_1 = require("../branch/repo/branch.repo");
const path_1 = require("path");
const fs_1 = require("fs");
let ClientService = class ClientService {
    constructor(clientAdapter, clientRepository, branchRepo) {
        this.clientAdapter = clientAdapter;
        this.clientRepository = clientRepository;
        this.branchRepo = branchRepo;
    }
    async saveClientDetails(dto) {
        try {
            const branchEntity = await this.branchRepo.findOne({ where: { id: dto.branchId } });
            if (!branchEntity) {
                throw new Error('Branch not found');
            }
            const entity = this.clientAdapter.convertDtoToEntity(dto);
            if (!entity.clientId) {
                const clientCount = await this.clientRepository.count({
                    where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
                });
                entity.clientId = this.generateClientId(branchEntity.branchName, clientCount + 1);
            }
            await this.clientRepository.save(entity);
            const message = dto.id
                ? 'Client details updated successfully'
                : 'Client details created successfully';
            return new common_response_1.CommonResponse(true, 201, message);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async deleteClientDetails(dto) {
        try {
            const client = await this.clientRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, 'Client not found');
            }
            await this.clientRepository.delete(dto.id);
            return new common_response_1.CommonResponse(true, 200, 'Client details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getClientDetails(req) {
        try {
            const client = await this.clientRepository.find({ relations: ['branch', 'voucherId'], where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, 'Client not found');
            }
            else {
                const data = this.clientAdapter.convertEntityToDto(client);
                return new common_response_1.CommonResponse(true, 200, 'Client details fetched successfully', data);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    generateClientId(branchName, sequenceNumber) {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        return `CLI(${branchName})-${paddedNumber}`;
    }
    async getClientNamesDropDown() {
        const data = await this.clientRepository.find({ select: ['name', 'id', 'clientId'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No branch names");
        }
    }
    async uploadClientPhoto(clientId, photo) {
        try {
            const client = await this.clientRepository.findOne({ where: { id: clientId } });
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, 'Client not found');
            }
            const filePath = (0, path_1.join)(__dirname, '../../uploads/client_photos', `${clientId}-${Date.now()}.jpg`);
            await fs_1.promises.writeFile(filePath, photo.buffer);
            client.clientPhoto = filePath;
            await this.clientRepository.save(client);
            return new common_response_1.CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_adapter_1.ClientAdapter,
        client_repo_1.ClientRepository,
        branch_repo_1.BranchRepository])
], ClientService);
//# sourceMappingURL=client.service.js.map