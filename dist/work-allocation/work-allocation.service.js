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
const notification_service_1 = require("../notifications/notification.service");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const work_allocation_repo_1 = require("./repo/work-allocation.repo");
const work_allocation_adapter_1 = require("./work-allocation.adapter");
const product_repo_1 = require("../product/repo/product.repo");
const technician_works_service_1 = require("../technician-works/technician-works.service");
const sales_man_repo_1 = require("../sales-man/repo/sales-man.repo");
let WorkAllocationService = class WorkAllocationService {
    constructor(workAllocationAdapter, workAllocationRepository, notificationService, productRepo, service, salesworkRepository) {
        this.workAllocationAdapter = workAllocationAdapter;
        this.workAllocationRepository = workAllocationRepository;
        this.notificationService = notificationService;
        this.productRepo = productRepo;
        this.service = service;
        this.salesworkRepository = salesworkRepository;
    }
    async updateWorkAllocationDetails(dto) {
        try {
            const workAllocation = await this.workAllocationRepository.findOne({
                where: { id: dto.id }
            });
            if (!workAllocation) {
                throw new Error('Work Allocation not found');
            }
            const updatedWorkAllocation = this.workAllocationAdapter.convertDtoToEntity(dto);
            console.log(workAllocation, "++++++}}}}}}}}}}}");
            console.log(updatedWorkAllocation, "{{{{{{{{{{{}}}}}}}}}}}}");
            Object.assign(workAllocation, updatedWorkAllocation);
            await this.workAllocationRepository.save(workAllocation);
            return new common_response_1.CommonResponse(true, 200, 'Work allocation updated successfully with product details');
        }
        catch (error) {
            console.error(`Error updating work allocation: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to update work allocation: ${error.message}`);
        }
    }
    async createWorkAllocationDetails(dto) {
        let newWorkAllocation;
        try {
            newWorkAllocation = this.workAllocationAdapter.convertDtoToEntity(dto);
            newWorkAllocation.workAllocationNumber = `#VOU-${(await this.workAllocationRepository.count() + 1)
                .toString()
                .padStart(5, '0')}`;
            await this.workAllocationRepository.insert(newWorkAllocation);
            return new common_response_1.CommonResponse(true, 200, 'Work allocation and technician details created successfully');
        }
        catch (error) {
            console.error(`Error creating work allocation details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to create work allocation details: ${error.message}`);
        }
    }
    async handleWorkAllocationDetails(dto) {
        if (dto.id || (dto.workAllocationNumber && dto.workAllocationNumber.trim() !== '')) {
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
            console.log(req, "req");
            const allocation = await this.workAllocationRepository.find({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId', 'voucherId']
            });
            console.log(allocation, "allocation");
            if (!allocation) {
                return new common_response_1.CommonResponse(false, 404, 'Work Allocation not found');
            }
            else {
                return new common_response_1.CommonResponse(true, 200, 'Work Allocation fetched successfully', allocation);
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
    async getTotalWorkAllocation(req) {
        const VoucherData = await this.workAllocationRepository.getTotalWorkAllocation(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
    async getMonthTotalWorkAllocation(req) {
        const VoucherData = await this.workAllocationRepository.getMonthTotalWorkAllocation(req);
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
    async getTotalPendingAndCompletedPercentage(req) {
        const VoucherData = await this.workAllocationRepository.getTotalPendingAndCompletedPercentage(req);
        if (!VoucherData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", VoucherData);
        }
    }
};
exports.WorkAllocationService = WorkAllocationService;
exports.WorkAllocationService = WorkAllocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [work_allocation_adapter_1.WorkAllocationAdapter,
        work_allocation_repo_1.WorkAllocationRepository,
        notification_service_1.NotificationService,
        product_repo_1.ProductRepository,
        technician_works_service_1.TechnicianService,
        sales_man_repo_1.SalesworkRepository])
], WorkAllocationService);
//# sourceMappingURL=work-allocation.service.js.map