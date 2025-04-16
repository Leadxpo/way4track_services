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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer = require("multer");
const common_req_1 = require("../models/common-req");
const common_response_1 = require("../models/common-response");
const staff_id_dto_1 = require("./dto/staff-id.dto");
const staff_dto_1 = require("./dto/staff.dto");
const staff_services_1 = require("./staff-services");
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
let StaffController = class StaffController {
    constructor(staffService) {
        this.staffService = staffService;
    }
    async handleStaffDetails(dto, files) {
        if (dto.id) {
            dto.id = Number(dto.id);
        }
        return this.staffService.handleStaffDetails(dto, files);
    }
    async deletestaffDetails(dto) {
        try {
            return this.staffService.deleteStaffDetails(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async getStaffVerification(dto) {
        try {
            return this.staffService.getStaffVerification(dto);
        }
        catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting assert details');
        }
    }
    async getStaffDetailsById(req) {
        try {
            return this.staffService.getStaffDetailsById(req);
        }
        catch (error) {
            console.log("Error in create address in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching staff type details');
        }
    }
    async getStaffNamesDropDown() {
        try {
            return this.staffService.getStaffNamesDropDown();
        }
        catch (error) {
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
    async getStaffDetails(req) {
        try {
            return this.staffService.getStaffDetails(req);
        }
        catch (error) {
            console.log("Error in create address in services..", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'photo', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'vehiclePhoto', maxCount: 1 },
        { name: 'qualificationFiles', maxCount: 5 },
        { name: 'offerLetter', maxCount: 1 },
        { name: 'resignationLetter', maxCount: 1 },
        { name: 'terminationLetter', maxCount: 1 },
        { name: 'appointmentLetter', maxCount: 1 },
        { name: 'leaveFormat', maxCount: 1 },
        { name: 'relievingLetter', maxCount: 1 },
        { name: 'experienceLetter', maxCount: 1 },
        { name: 'experience', maxCount: 5 }
    ], multerOptions)),
    (0, common_1.Post)('handleStaffDetails'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_dto_1.StaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "handleStaffDetails", null);
__decorate([
    (0, common_1.Post)('deletestaffDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_id_dto_1.StaffIdDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "deletestaffDetails", null);
__decorate([
    (0, common_1.Post)('getStaffVerification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_dto_1.StaffDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffVerification", null);
__decorate([
    (0, common_1.Post)('getStaffDetailsById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [staff_id_dto_1.StaffIdDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffDetailsById", null);
__decorate([
    (0, common_1.Post)('getStaffNamesDropDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffNamesDropDown", null);
__decorate([
    (0, common_1.Post)('getStaffDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_req_1.CommonReq]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffDetails", null);
exports.StaffController = StaffController = __decorate([
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_services_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map