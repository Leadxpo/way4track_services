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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendence_service_1 = require("./attendence.service");
const attendence_dto_1 = require("./dto/attendence.dto");
const common_response_1 = require("../models/common-response");
const platform_express_1 = require("@nestjs/platform-express");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async updateAttendanceDetails(dto) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return this.attendanceService.updateAttendanceDetails(dto);
        }
        catch (error) {
            console.error('Error in save attendance details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving attendance details');
        }
    }
    async getAttendanceDetails() {
        try {
            return this.attendanceService.getAttendanceDetails();
        }
        catch (error) {
            console.error('Error in save attendance details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving attendance details');
        }
    }
    async getAttendanceDetailsById(req) {
        try {
            return this.attendanceService.getAttendanceDetailsById(req);
        }
        catch (error) {
            console.error('Error in save attendance details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving attendance details');
        }
    }
    async getStaffAttendance(req) {
        try {
            return this.attendanceService.getStaffAttendance(req);
        }
        catch (error) {
            console.error('Error in get attendance details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching attendance details');
        }
    }
    async uploadAttendance(file) {
        if (!file) {
            return { message: 'No file uploaded' };
        }
        return await this.attendanceService.processAttendanceExcel(file);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('updateAttendanceDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendence_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateAttendanceDetails", null);
__decorate([
    (0, common_1.Post)('getAttendanceDetails'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceDetails", null);
__decorate([
    (0, common_1.Post)('getAttendanceDetailsById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendence_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceDetailsById", null);
__decorate([
    (0, common_1.Post)('getStaffAttendance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getStaffAttendance", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "uploadAttendance", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendence_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendence.controller.js.map