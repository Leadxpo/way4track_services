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
exports.RequestRaiseController = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const request_raise_id_dto_1 = require("./dto/request-raise-id.dto");
const request_raise_dto_1 = require("./dto/request-raise.dto");
const request_raise_service_1 = require("./request-raise.service");
const common_req_1 = require("../models/common-req");
let RequestRaiseController = class RequestRaiseController {
    constructor(requestService) {
        this.requestService = requestService;
    }
    async handleRequestDetails(dto) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.requestService.handleRequestDetails(dto);
        }
        catch (error) {
            console.error('Error in save request details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving request details');
        }
    }
    async deleteRequestDetails(dto) {
        try {
            return await this.requestService.deleteRequestDetails(dto);
        }
        catch (error) {
            console.error('Error in delete request details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting request details');
        }
    }
    async getRequestDetails(dto) {
        try {
            return await this.requestService.getRequestDetails(dto);
        }
        catch (error) {
            console.error('Error in get request details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching request details');
        }
    }
    async getAllRequestDetails(dto) {
        try {
            return await this.requestService.getAllRequestDetails(dto);
        }
        catch (error) {
            console.error('Error in get request details in service:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching request details');
        }
    }
    async getRequestsDropDown() {
        try {
            return this.requestService.getRequestsDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async getRequests(req) {
        try {
            return this.requestService.getRequests(req);
        }
        catch (error) {
            console.error('Error in delete vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
    async getRequestBranchWise(req) {
        try {
            return await this.requestService.getRequestBranchWise(req);
        }
        catch (error) {
            console.error('Error in getTodayRequestBranchWise:', error);
            return new common_response_1.CommonResponse(false, 500, "Error fetching today's requests");
        }
    }
};
exports.RequestRaiseController = RequestRaiseController;
__decorate([
    (0, common_1.Post)('handleRequestDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_raise_dto_1.RequestRaiseDto]),
    __metadata("design:returntype", Promise)
], RequestRaiseController.prototype, "handleRequestDetails", null);
__decorate([
    (0, common_1.Post)('deleteRequestDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_raise_id_dto_1.RequestRaiseIdDto]),
    __metadata("design:returntype", Promise)
], RequestRaiseController.prototype, "deleteRequestDetails", null);
__decorate([
    (0, common_1.Post)('getRequestDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_raise_id_dto_1.RequestRaiseIdDto]),
    __metadata("design:returntype", Promise)
], RequestRaiseController.prototype, "getRequestDetails", null);
__decorate([
    (0, common_1.Post)('getAllRequestDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], RequestRaiseController.prototype, "getAllRequestDetails", null);
__decorate([
    (0, common_1.Post)('getRequestsDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestRaiseController.prototype, "getRequestsDropDown", null);
__decorate([
    (0, common_1.Post)('getRequestsBySearch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestRaiseController.prototype, "getRequests", null);
__decorate([
    (0, common_1.Post)('getRequestBranchWise'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestRaiseController.prototype, "getRequestBranchWise", null);
exports.RequestRaiseController = RequestRaiseController = __decorate([
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [request_raise_service_1.RequestRaiseService])
], RequestRaiseController);
//# sourceMappingURL=request-raise.controller.js.map