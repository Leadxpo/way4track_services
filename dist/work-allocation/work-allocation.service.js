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
exports.WorkAllocationService = void 0;
const common_1 = require("@nestjs/common");
const work_allocation_repo_1 = require("./repo/work-allocation.repo");
const work_allocation_adapter_1 = require("./work-allocation.adapter");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
let WorkAllocationService = class WorkAllocationService {
    constructor(workAllocationAdapter, workAllocationRepository) {
        this.workAllocationAdapter = workAllocationAdapter;
        this.workAllocationRepository = workAllocationRepository;
    }
    async updateWorkAllocationDetails(dto) {
        try {
            const existingWorkAllocation = await this.workAllocationRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
            });
            if (!existingWorkAllocation) {
                return new common_response_1.CommonResponse(false, 4002, 'Work Allocation not found for the provided details.');
            }
            Object.assign(existingWorkAllocation, this.workAllocationAdapter.convertDtoToEntity(dto));
            await this.workAllocationRepository.save(existingWorkAllocation);
            return new common_response_1.CommonResponse(true, 65152, 'Work Allocation updated successfully');
        }
        catch (error) {
            console.error(`Error updating work allocation details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to update work allocation details: ${error.message}`);
        }
    }
    async createWorkAllocationDetails(dto) {
        try {
            const entity = this.workAllocationAdapter.convertDtoToEntity(dto);
            const allocationCount = await this.workAllocationRepository.count({});
            entity.workAllocationNumber = this.generateWorkAllocationNumber(allocationCount + 1);
            await this.workAllocationRepository.save(entity);
            return new common_response_1.CommonResponse(true, 201, 'Work Allocation created successfully');
        }
        catch (error) {
            console.error(`Error creating work allocation details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to create work allocation details: ${error.message}`);
        }
    }
    async handleWorkAllocationDetails(dto) {
        if (dto.id || dto.workAllocationNumber) {
            return await this.updateWorkAllocationDetails(dto);
        }
        else {
            return await this.createWorkAllocationDetails(dto);
        }
    }
    async deleteWorkAllocation(req) {
        try {
            const allocation = await this.workAllocationRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!allocation) {
                return new common_response_1.CommonResponse(false, 404, 'Work Allocation not found');
            }
            await this.workAllocationRepository.delete(req.id);
            return new common_response_1.CommonResponse(true, 200, 'Work Allocation deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getWorkAllocationDetails(req) {
        try {
            const allocation = await this.workAllocationRepository.find({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId']
            });
            if (!allocation) {
                return new common_response_1.CommonResponse(false, 404, 'Work Allocation not found');
            }
            else {
                const data = await this.workAllocationAdapter.convertEntityToDto(allocation);
                console.log(data, "++++++++++++++++++++++++");
                return new common_response_1.CommonResponse(true, 200, 'Work Allocation fetched successfully', data);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getWorkAllocation(req) {
        const VoucherData = await this.workAllocationRepository.getWorkAllocation(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    generateWorkAllocationNumber(sequenceNumber) {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `#VOU-${paddedNumber}`;
    }
};
exports.WorkAllocationService = WorkAllocationService;
exports.WorkAllocationService = WorkAllocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [work_allocation_adapter_1.WorkAllocationAdapter,
        work_allocation_repo_1.WorkAllocationRepository])
], WorkAllocationService);
//# sourceMappingURL=work-allocation.service.js.map