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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const permissions_dto_1 = require("./dto/permissions.dto");
const common_response_1 = require("../models/common-response");
const permission_id_dto_1 = require("./dto/permission-id.dto");
const permissions_services_1 = require("./permissions.services");
let PermissionsController = class PermissionsController {
    constructor(service) {
        this.service = service;
    }
    async updatePermissionDetails(dto) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return this.service.updatePermissionDetails(dto);
        }
        catch (error) {
            console.log("Error in create Permission in services..", error);
        }
    }
    async savePermissionDetails(dto) {
        try {
            return this.service.savePermissionDetails(dto);
        }
        catch (error) {
            console.log("Error in create Permission in services..", error);
        }
    }
    async getPermissionDetails(req) {
        try {
            return this.service.getPermissionDetails(req);
        }
        catch (error) {
            console.log("Error in create Permission in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }
    async getStaffPermissions(req) {
        try {
            return this.service.getStaffPermissions(req);
        }
        catch (error) {
            console.log("Error in create Permission in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }
    async editPermissions({ staffId, companyCode, unitCode }) {
        try {
            return this.service.editPermissions(staffId, companyCode, unitCode);
        }
        catch (error) {
            console.log("Error in create Permission in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }
    async addPermissions({ staffId, companyCode, unitCode }) {
        try {
            return this.service.addPermissions(staffId, companyCode, unitCode);
        }
        catch (error) {
            console.log("Error in create Permission in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }
    async viewPermissions({ staffId, companyCode, unitCode }) {
        try {
            return this.service.viewPermissions(staffId, companyCode, unitCode);
        }
        catch (error) {
            console.log("Error in create Permission in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }
    async deletePermissions(staffId, companyCode, unitCode) {
        try {
            return this.service.deletePermissions(staffId, companyCode, unitCode);
        }
        catch (error) {
            console.log("Error in create Permission in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Post)('handlePermissionDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permissions_dto_1.PermissionsDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "updatePermissionDetails", null);
__decorate([
    (0, common_1.Post)('savePermissionDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permissions_dto_1.PermissionsDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "savePermissionDetails", null);
__decorate([
    (0, common_1.Post)('getPermissionDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permission_id_dto_1.PermissionIdDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getPermissionDetails", null);
__decorate([
    (0, common_1.Post)('getStaffPermissions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getStaffPermissions", null);
__decorate([
    (0, common_1.Post)('editPermissions'),
    __param(0, (0, common_1.Body)()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "editPermissions", null);
__decorate([
    (0, common_1.Post)('addPermissions'),
    __param(0, (0, common_1.Body)()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "addPermissions", null);
__decorate([
    (0, common_1.Post)('viewPermissions'),
    __param(0, (0, common_1.Body)()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "viewPermissions", null);
__decorate([
    (0, common_1.Post)('deletePermissions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "deletePermissions", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_services_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map