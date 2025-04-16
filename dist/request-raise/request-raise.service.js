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
exports.RequestRaiseService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const request_raise_adapter_1 = require("./request-raise.adapter");
const request_raise_repo_1 = require("./repo/request-raise.repo");
const notification_entity_1 = require("../notifications/entity/notification.entity");
const notification_service_1 = require("../notifications/notification.service");
const branch_entity_1 = require("../branch/entity/branch.entity");
const staff_entity_1 = require("../staff/entity/staff.entity");
let RequestRaiseService = class RequestRaiseService {
    constructor(requestAdapter, requestRepository, notificationService) {
        this.requestAdapter = requestAdapter;
        this.requestRepository = requestRepository;
        this.notificationService = notificationService;
    }
    async updateRequestDetails(dto) {
        try {
            const existingRequest = await this.requestRepository.findOne({
                where: { id: dto.id, requestId: dto.requestId }
            });
            if (!existingRequest) {
                return new common_response_1.CommonResponse(false, 4002, 'Request not found for the provided id.');
            }
            const updatedEntity = this.requestAdapter.convertDtoToEntity(dto);
            Object.assign(existingRequest, updatedEntity);
            if (Object.keys(updatedEntity).length === 0) {
                throw new Error("No update values found, skipping update operation.");
            }
            await this.requestRepository.save(existingRequest);
            return new common_response_1.CommonResponse(true, 65152, 'Request details updated successfully');
        }
        catch (error) {
            console.error(`Error updating request details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to update request details: ${error.message}`);
        }
    }
    async createRequestDetails(dto) {
        let successResponse;
        let entity;
        try {
            entity = this.requestAdapter.convertDtoToEntity(dto);
            entity.id = null;
            entity.requestId = `RR-${(await this.requestRepository.count() + 1).toString().padStart(5, '0')}`;
            console.log("Saving entity:", entity);
            const insertResult = await this.requestRepository.insert(entity);
            if (!insertResult.identifiers.length) {
                throw new Error('Failed to save request details');
            }
            successResponse = new common_response_1.CommonResponse(true, 201, 'Request details created successfully');
            try {
                await this.notificationService.createNotification(entity, notification_entity_1.NotificationEnum.Request);
            }
            catch (notificationError) {
                console.error(`Notification failed: ${notificationError.message}`, notificationError.stack);
            }
            return successResponse;
        }
        catch (error) {
            console.error(`Error creating request details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to create request details: ${error.message}`);
        }
    }
    async handleRequestDetails(dto) {
        if (dto.id && dto.id !== null || (dto.requestId && dto.requestId.trim() !== '')) {
            return await this.updateRequestDetails(dto);
        }
        else {
            return await this.createRequestDetails(dto);
        }
    }
    async deleteRequestDetails(dto) {
        try {
            const request = await this.requestRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!request) {
                return new common_response_1.CommonResponse(false, 404, 'Request not found');
            }
            await this.requestRepository.delete(dto.id);
            return new common_response_1.CommonResponse(true, 200, 'Request details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getRequestDetails(req) {
        try {
            const request = await this.requestRepository.findOne({ relations: ['staffId', 'branchId'], where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!request) {
                return new common_response_1.CommonResponse(false, 404, 'Request not found');
            }
            return new common_response_1.CommonResponse(true, 200, 'Request details fetched successfully', request);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getAllRequestDetails(req) {
        try {
            const request = await this.requestRepository.find({ relations: ['staffId', 'branchId'], where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!request) {
                return new common_response_1.CommonResponse(false, 404, 'Request not found');
            }
            return new common_response_1.CommonResponse(true, 200, 'Request details fetched successfully', request);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getRequestsDropDown() {
        const data = await this.requestRepository.find({ select: ['id', 'requestId'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No branch names");
        }
    }
    async getRequestBranchWise(req) {
        const data = await this.requestRepository.getRequestBranchWise(req);
        return data.length
            ? new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data)
            : new common_response_1.CommonResponse(true, 4579, "There are no branch names", data);
    }
    async getRequests(filter) {
        const query = this.requestRepository.createQueryBuilder('req')
            .select([
            'req.request_id AS requestNumber',
            'req.id AS requestId',
            'branch.name AS branchName',
            'req.created_date AS paymentDate',
            'req.request_type AS requestType',
            'req.status AS status',
            'sf.name AS RequestTo'
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'req.branch_id = branch.id')
            .leftJoin(staff_entity_1.StaffEntity, 'sf', 'req.request_to = sf.id')
            .where('req.company_code = :companyCode', { companyCode: filter.companyCode })
            .andWhere('req.unit_code = :unitCode', { unitCode: filter.unitCode })
            .orderBy('req.created_date', 'DESC');
        if (filter.staffId) {
            query.andWhere('sf.staff_id = :staffId', { staffId: filter.staffId });
        }
        if (filter.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: filter.branchName });
        }
        if (filter.fromDate) {
            query.andWhere('DATE(req.created_date) >= :fromDate', { fromDate: filter.fromDate });
        }
        if (filter.toDate) {
            query.andWhere('DATE(req.created_date) <= :toDate', { toDate: filter.toDate });
        }
        const result = await query.getRawMany();
        return result;
    }
};
exports.RequestRaiseService = RequestRaiseService;
exports.RequestRaiseService = RequestRaiseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_raise_adapter_1.RequestRaiseAdapter,
        request_raise_repo_1.RequestRaiseRepository,
        notification_service_1.NotificationService])
], RequestRaiseService);
//# sourceMappingURL=request-raise.service.js.map