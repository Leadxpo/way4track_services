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
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async createAttendance(dto) {
        try {
            return this.attendanceService.saveAttendance(dto);
        }
        catch (error) {
            console.error('Error in save attendance details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving attendance details');
        }
    }
    async getAttendance(staffId, branchId) {
        try {
            return this.attendanceService.getAttendance(staffId, branchId);
        }
        catch (error) {
            console.error('Error in get attendance details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching attendance details');
        }
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('createAttendance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendence_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "createAttendance", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Query)('staffId')),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendance", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendence_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendence.controller.js.map