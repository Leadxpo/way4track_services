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
const branch_entity_1 = require("../branch/entity/branch.entity");
const branch_repo_1 = require("../branch/repo/branch.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const client_adapter_1 = require("./client.adapter");
const client_repo_1 = require("./repo/client.repo");
const storage_1 = require("@google-cloud/storage");
let ClientService = class ClientService {
    constructor(clientAdapter, clientRepository, branchRepo) {
        this.clientAdapter = clientAdapter;
        this.clientRepository = clientRepository;
        this.branchRepo = branchRepo;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async handleClientDetails(dto, photo) {
        try {
            let photoPath = null;
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `client_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);
                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });
                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                photoPath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }
            if (dto.id || (dto.clientId && dto.clientId.trim() !== '')) {
                console.log(dto, "updateClientDetails{{{{{{{{{{{{{");
                return await this.updateClientDetails(dto, photoPath);
            }
            else {
                console.log(dto, "createClientDetails{{{{{{{{{{{{{");
                return await this.createClientDetails(dto, photoPath);
            }
        }
        catch (error) {
            console.error(`Error handling client details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to handle client details: ${error.message}`);
        }
    }
    async createClientDetails(dto, photoPath) {
        try {
            console.log(dto, "KKKKKKKKKKKKKK");
            const branchEntity = await this.branchRepo.findOne({ where: { id: dto.branch } });
            if (!branchEntity) {
                throw new Error('Branch not found');
            }
            const entity = this.clientAdapter.convertDtoToEntity(dto);
            entity.clientId = `CLI(${branchEntity.branchName})-${(await this.clientRepository.count() + 1).toString().padStart(5, '0')}`;
            if (photoPath) {
                entity.clientPhoto = photoPath;
            }
            const branch = new branch_entity_1.BranchEntity();
            branch.id = dto.branch;
            entity.branch = branch;
            console.log(entity, "entity");
            await this.clientRepository.insert(entity);
            return new common_response_1.CommonResponse(true, 201, 'Client details created successfully');
        }
        catch (error) {
            console.error(`Error creating client details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to create client details: ${error.message}`);
        }
    }
    async updateClientDetails(dto, photoPath) {
        try {
            let existingClient = null;
            if (dto.id) {
                existingClient = await this.clientRepository.findOne({ where: { id: dto.id } });
            }
            else if (dto.clientId) {
                existingClient = await this.clientRepository.findOne({ where: { clientId: dto.clientId } });
            }
            if (!existingClient) {
                throw new Error('Client not found');
            }
            if (photoPath && existingClient.clientPhoto) {
                const existingFilePath = existingClient.clientPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                const file = this.storage.bucket(this.bucketName).file(existingFilePath);
                try {
                    await file.delete();
                    console.log(`Deleted old file from GCS: ${existingFilePath}`);
                }
                catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }
            const entity = this.clientAdapter.convertDtoToEntity(dto);
            if (dto.branch) {
                const branchEntity = await this.branchRepo.findOne({ where: { id: dto.branch } });
                if (!branchEntity) {
                    throw new Error(`Branch with name '${dto.branch}' not found`);
                }
                entity.branch = branchEntity;
            }
            const updatedClient = {
                ...existingClient,
                ...entity,
                clientPhoto: photoPath ?? existingClient.clientPhoto,
            };
            console.log('Updated client payload:', updatedClient);
            await this.clientRepository.save(updatedClient);
            return new common_response_1.CommonResponse(true, 200, 'Client details updated successfully');
        }
        catch (error) {
            console.error(`Error updating client details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to update client details: ${error.message}`);
        }
    }
    async deleteClientDetails(dto) {
        try {
            const client = await this.clientRepository.findOne({
                where: {
                    clientId: String(dto.clientId),
                    companyCode: dto.companyCode,
                    unitCode: dto.unitCode
                }
            });
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, 'Client not found');
            }
            await this.clientRepository.delete({ clientId: String(dto.clientId) });
            return new common_response_1.CommonResponse(true, 200, 'Client details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getClientDetailsById(req) {
        try {
            console.log(req, "+++++++++++");
            const client = await this.clientRepository.findOne({ relations: ['branch'], where: { clientId: req.clientId, companyCode: req.companyCode, unitCode: req.unitCode } });
            console.log(client, "+++++++++++");
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, 'Client not found');
            }
            else {
                return new common_response_1.CommonResponse(true, 200, 'Client details fetched successfully', client);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getClientDetails(req) {
        try {
            const client = await this.clientRepository.find({ relations: ['branch', 'voucherId'], where: { companyCode: req.companyCode, unitCode: req.unitCode } });
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
    async getClientNamesDropDown() {
        const data = await this.clientRepository.find({ select: ['name', 'id', 'clientId'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No branch names");
        }
    }
    async updateIsStatus(req) {
        const client = await this.clientRepository.findOne({ where: { id: req.id } });
        if (!client) {
            return new common_response_1.CommonResponse(false, 6541, "No Data Found");
        }
        const updatedFields = {};
        if (req.hasOwnProperty('tds')) {
            updatedFields.tds = !client.tds;
        }
        if (req.hasOwnProperty('tcs')) {
            updatedFields.tcs = !client.tcs;
        }
        if (req.hasOwnProperty('billWiseDate')) {
            updatedFields.billWiseDate = !client.billWiseDate;
        }
        if (Object.keys(updatedFields).length > 0) {
            await this.clientRepository.update({ id: req.id }, updatedFields);
        }
        return new common_response_1.CommonResponse(true, 65152, "Status updated successfully");
    }
    async getClientVerification(req) {
        let data = null;
        if (req.phoneNumber) {
            data = await this.clientRepository.findOne({ where: { phoneNumber: req.phoneNumber } });
        }
        else if (req.email) {
            data = await this.clientRepository.findOne({ where: { email: req.email } });
        }
        if (data) {
            return new common_response_1.CommonResponse(false, 75483, "Data already exists", 'false');
        }
        else {
            return new common_response_1.CommonResponse(true, 4579, "No matching data found", 'true');
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