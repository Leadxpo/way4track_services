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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const permissions_adapter_1 = require("./permissions.adapter");
const permissions_repo_1 = require("./repo/permissions.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const staff_entity_1 = require("../staff/entity/staff.entity");
const role_enum_1 = require("./dto/role.enum");
let PermissionsService = class PermissionsService {
    constructor(adapter, repo) {
        this.adapter = adapter;
        this.repo = repo;
    }
    getDefaultPermissions(designation) {
        switch (designation) {
            case staff_entity_1.DesignationEnum.CEO:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.HR:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.Accountant:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.Operator:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.BranchManager:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.WarehouseManager:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.SubDealer:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.Technician:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.SalesMan:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            case staff_entity_1.DesignationEnum.CallCenter:
                return [
                    { name: role_enum_1.Roles.Branch, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Assets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Appointments, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Staff, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Client, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Vendor, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.SubDealer, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Hiring, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Bank, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Product, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Tickets, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Voucher, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Estimate, add: true, edit: true, view: true },
                    { name: role_enum_1.Roles.Attendance, add: true, edit: true, view: true }
                ];
            default:
                return [];
        }
    }
    async savePermissionDetails(dto) {
        try {
            if (!dto.designation) {
                throw new error_response_1.ErrorResponse(400, 'Designation is required');
            }
            dto.permissions = dto.permissions.length
                ? dto.permissions
                : this.getDefaultPermissions(dto.designation);
            const entity = this.adapter.convertPermissionDtoToEntity(dto);
            await this.repo.save(entity);
            return new common_response_1.CommonResponse(true, 65152, 'Permission Details Created Successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5416, error.message);
        }
    }
    async updatePermissionDetails(dto) {
        try {
            const existingRecord = await this.repo.findOne({
                where: dto.id ? { id: dto.id } : { userId: dto.userId },
            });
            if (!existingRecord) {
                throw new error_response_1.ErrorResponse(5417, 'Permission record not found');
            }
            const updatedRecord = this.repo.merge(existingRecord, this.adapter.convertPermissionDtoToEntity(dto));
            await this.repo.save(updatedRecord);
            return new common_response_1.CommonResponse(true, 65152, 'Permission Details Updated Successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5416, error.message);
        }
    }
    async handlePermissionDetails(dto) {
        if (dto.id) {
            return this.updatePermissionDetails(dto);
        }
        else {
            return this.savePermissionDetails(dto);
        }
    }
    async getPermissionDetails(req) {
        try {
            const permissions = await this.repo.findOne({
                where: { userId: req.userId, companyCode: req.companyCode, unitCode: req.unitCode },
            });
            if (!permissions) {
                return new common_response_1.CommonResponse(false, 404, 'Permissions not found');
            }
            return new common_response_1.CommonResponse(true, 200, 'Permission details fetched successfully', permissions);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permissions_adapter_1.PermissionAdapter,
        permissions_repo_1.PermissionRepository])
], PermissionsService);
//# sourceMappingURL=permissions.services.js.map