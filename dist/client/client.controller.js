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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
const client_id_dto_1 = require("./dto/client-id.dto");
const common_response_1 = require("../models/common-response");
const client_dto_1 = require("./dto/client.dto");
const client_service_1 = require("./client.service");
const platform_express_1 = require("@nestjs/platform-express");
const common_req_1 = require("../models/common-req");
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    async handleClientDetails(dto, file) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.clientService.handleClientDetails(dto, file);
        }
        catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }
    async deleteClientDetails(dto) {
        try {
            return await this.clientService.deleteClientDetails(dto);
        }
        catch (error) {
            console.error('Error in delete client details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting client details');
        }
    }
    async getClientDetails(req) {
        try {
            return await this.clientService.getClientDetails(req);
        }
        catch (error) {
            console.error('Error in get client details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching client details');
        }
    }
    async getClientDetailsById(req) {
        try {
            return await this.clientService.getClientDetailsById(req);
        }
        catch (error) {
            console.error('Error in get client details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching client details');
        }
    }
    async getClientNamesDropDown() {
        try {
            return this.clientService.getClientNamesDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async updateIsStatus(dto) {
        return this.clientService.updateIsStatus(dto);
    }
    async getClientVerification(req) {
        try {
            return this.clientService.getClientVerification(req);
        }
        catch (error) {
            console.log("Error in create address in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Post)('handleClientDetails'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_dto_1.ClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "handleClientDetails", null);
__decorate([
    (0, common_1.Post)('deleteClientDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_id_dto_1.ClientIdDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "deleteClientDetails", null);
__decorate([
    (0, common_1.Post)('getClientDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientDetails", null);
__decorate([
    (0, common_1.Post)('getClientDetailsById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_id_dto_1.ClientIdDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientDetailsById", null);
__decorate([
    (0, common_1.Post)('getClientNamesDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientNamesDropDown", null);
__decorate([
    (0, common_1.Post)('updateIsStatus'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_id_dto_1.ClientIdDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "updateIsStatus", null);
__decorate([
    (0, common_1.Post)('getClientVerification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_dto_1.ClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientVerification", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.Controller)('client'),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
//# sourceMappingURL=client.controller.js.map