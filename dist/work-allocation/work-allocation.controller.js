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
exports.WorkAllocationController = void 0;
const common_1 = require("@nestjs/common");
const work_allocation_service_1 = require("./work-allocation.service");
const work_allocation_dto_1 = require("./dto/work-allocation.dto");
const work_allocation_id_dto_1 = require("./dto/work-allocation-id.dto");
const common_response_1 = require("../models/common-response");
let WorkAllocationController = class WorkAllocationController {
    constructor(workAllocationService) {
        this.workAllocationService = workAllocationService;
    }
    async handleWorkAllocationDetails(dto) {
        try {
            return this.workAllocationService.handleWorkAllocationDetails(dto);
        }
        catch (error) {
            console.error('Error in save vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error saving vendor details');
        }
    }
    async getWorkAllocationDetails(dto) {
        try {
            return this.workAllocationService.getWorkAllocationDetails(dto);
        }
        catch (error) {
            console.error('Error in get vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching vendor details');
        }
    }
    async deleteWorkAllocation(dto) {
        try {
            return this.workAllocationService.deleteWorkAllocation(dto);
        }
        catch (error) {
            console.error('Error in delete vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
    async getWorkAllocation(req) {
        try {
            return this.workAllocationService.getWorkAllocation(req);
        }
        catch (error) {
            console.error('Error in delete vendor details:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
};
exports.WorkAllocationController = WorkAllocationController;
__decorate([
    (0, common_1.Post)('handleWorkAllocationDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [work_allocation_dto_1.WorkAllocationDto]),
    __metadata("design:returntype", Promise)
], WorkAllocationController.prototype, "handleWorkAllocationDetails", null);
__decorate([
    (0, common_1.Post)('getWorkAllocationDetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [work_allocation_id_dto_1.WorkAllocationIdDto]),
    __metadata("design:returntype", Promise)
], WorkAllocationController.prototype, "getWorkAllocationDetails", null);
__decorate([
    (0, common_1.Post)('deleteWorkAllocation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [work_allocation_id_dto_1.WorkAllocationIdDto]),
    __metadata("design:returntype", Promise)
], WorkAllocationController.prototype, "deleteWorkAllocation", null);
__decorate([
    (0, common_1.Post)('getWorkAllocation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkAllocationController.prototype, "getWorkAllocation", null);
exports.WorkAllocationController = WorkAllocationController = __decorate([
    (0, common_1.Controller)('work-allocations'),
    __metadata("design:paramtypes", [work_allocation_service_1.WorkAllocationService])
], WorkAllocationController);
//# sourceMappingURL=work-allocation.controller.js.map