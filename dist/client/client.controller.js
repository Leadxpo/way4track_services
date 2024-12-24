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
const client_id_dto_1 = require("./dto/client-id.dto");
const common_response_1 = require("../models/common-response");
const client_dto_1 = require("./dto/client.dto");
const client_service_1 = require("./client.service");
const platform_express_1 = require("@nestjs/platform-express");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    async saveClientDetails(dto) {
        try {
            return await this.clientService.saveClientDetails(dto);
        }
        catch (error) {
            console.error('Error in save client details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving client details');
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
    async getClientNamesDropDown() {
        try {
            return this.clientService.getClientNamesDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async uploadPhoto(clientId, photo) {
        try {
            return await this.clientService.uploadClientPhoto(clientId, photo);
        }
        catch (error) {
            console.error('Error uploading client photo:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error uploading photo');
        }
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Post)('saveClientDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_dto_1.ClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "saveClientDetails", null);
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
    __metadata("design:paramtypes", [client_id_dto_1.ClientIdDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientDetails", null);
__decorate([
    (0, common_1.Post)('getClientNamesDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClientNamesDropDown", null);
__decorate([
    (0, common_1.Post)('uploadPhoto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Body)('clientId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "uploadPhoto", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.Controller)('client'),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
//# sourceMappingURL=client.controller.js.map