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
const staff_repo_1 = require("../staff/repo/staff-repo");
const designation_service_1 = require("../designation/designation.service");
const staff_status_1 = require("../staff/enum/staff-status");
const designation_repo_1 = require("../designation/repo/designation.repo");
let PermissionsService = class PermissionsService {
    constructor(adapter, repo, staffRepo, designationSerie, desRepo) {
        this.adapter = adapter;
        this.repo = repo;
        this.staffRepo = staffRepo;
        this.designationSerie = designationSerie;
        this.desRepo = desRepo;
    }
    async savePermissionDetails(dto) {
        try {
            const staff = await this.staffRepo.findOne({ where: { staffId: dto.staffId }, relations: ['designationRelation'] });
            if (!staff) {
                throw new error_response_1.ErrorResponse(5417, 'Staff not found');
            }
            console.log("Incoming Permissions:", dto.permissions);
            const staffDesignation = await this.desRepo.findOne({
                where: { designation: staff.designation }
            });
            if (!staffDesignation) {
                throw new error_response_1.ErrorResponse(5419, 'Staff designation is missing or invalid');
            }
            console.log(staffDesignation, "???????????????");
            const designationRes = await this.designationSerie.getDesignation({
                designation: staffDesignation.designation,
                companyCode: staff.companyCode,
                unitCode: staff.unitCode
            });
            console.log(designationRes, "++++++++++++++");
            if (!designationRes || !designationRes.data) {
                throw new error_response_1.ErrorResponse(5418, 'Default permissions not found for designation');
            }
            dto.permissions = dto.permissions ?? designationRes.data.roles;
            console.log("Final Permissions Applied:", dto.permissions);
            const entity = this.adapter.convertPermissionDtoToEntity(dto);
            entity.staffId = staff;
            entity.permissions = dto.permissions;
            console.log("Entity Before Save:", entity);
            await this.repo.insert(entity);
            return new common_response_1.CommonResponse(true, 65152, 'Permission Details Created Successfully');
        }
        catch (error) {
            console.error('Error:', error.message);
            throw new error_response_1.ErrorResponse(5416, error.message);
        }
    }
    async updatePermissionDetails(dto) {
        try {
            const staff = await this.staffRepo.findOne({
                where: { staffId: dto.staffId },
                relations: ['designationRelation']
            });
            if (!staff) {
                throw new error_response_1.ErrorResponse(5417, 'Staff not found');
            }
            const currentPermission = await this.repo.findOne({
                where: { staffId: staff, staffStatus: staff_status_1.StaffStatus.ACTIVE }
            });
            if (currentPermission) {
                currentPermission.staffStatus = staff_status_1.StaffStatus.INACTIVE;
                currentPermission.endDate = new Date();
                await this.repo.save(currentPermission);
            }
            const newPermission = this.adapter.convertPermissionDtoToEntity(dto);
            newPermission.staffId = staff;
            newPermission.staffStatus = staff_status_1.StaffStatus.ACTIVE;
            newPermission.startDate = new Date();
            await this.repo.insert(newPermission);
            return new common_response_1.CommonResponse(true, 65152, 'Permission Details Updated Successfully');
        }
        catch (error) {
            console.error('Error:', error.message);
            throw new error_response_1.ErrorResponse(5416, error.message);
        }
    }
    async getPermissionDetails(req) {
        try {
            const permissions = await this.repo.findOne({
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['subDealerId', 'staffId']
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
    async addPermissions(staffId, companyCode, unitCode) {
        const staff = await this.staffRepo.findOne({ where: { staffId: staffId, companyCode: companyCode, unitCode: unitCode } });
        if (!staff) {
            return new common_response_1.CommonResponse(false, 404, "staff not found");
        }
        const addPermission = await this.repo.findOne({ where: { staffId: staff, companyCode: companyCode, unitCode: unitCode } });
        if (!addPermission) {
            throw new Error('Product assignment not found');
        }
        addPermission.permissions[0].add = true;
        await this.repo.save(addPermission);
        return new common_response_1.CommonResponse(true, 200, 'Permission details fetched successfully', addPermission);
    }
    async viewPermissions(staffId, companyCode, unitCode) {
        const staff = await this.staffRepo.findOne({ where: { staffId: staffId, companyCode: companyCode, unitCode: unitCode } });
        if (!staff) {
            return new common_response_1.CommonResponse(false, 404, "staff not found");
        }
        const addPermission = await this.repo.findOne({ where: { staffId: staff, companyCode: companyCode, unitCode: unitCode } });
        if (!addPermission) {
            throw new Error('Product assignment not found');
        }
        addPermission.permissions[0].view = true;
        await this.repo.save(addPermission);
        return new common_response_1.CommonResponse(true, 200, 'Permission details fetched successfully', addPermission);
    }
    async deletePermissions(staffId, companyCode, unitCode) {
        const staff = await this.staffRepo.findOne({ where: { staffId: staffId, companyCode: companyCode, unitCode: unitCode } });
        if (!staff) {
            return new common_response_1.CommonResponse(false, 404, "staff not found");
        }
        const addPermission = await this.repo.findOne({ where: { staffId: staff, companyCode: companyCode, unitCode: unitCode } });
        if (!addPermission) {
            throw new Error('Product assignment not found');
        }
        addPermission.permissions[0].delete = true;
        await this.repo.save(addPermission);
        return new common_response_1.CommonResponse(true, 200, 'Permission details fetched successfully', addPermission);
    }
    async editPermissions(staffId, companyCode, unitCode) {
        const staff = await this.staffRepo.findOne({ where: { staffId: staffId, companyCode: companyCode, unitCode: unitCode } });
        if (!staff) {
            return new common_response_1.CommonResponse(false, 404, "staff not found");
        }
        const addPermission = await this.repo.findOne({ where: { staffId: staff, companyCode: companyCode, unitCode: unitCode } });
        if (!addPermission) {
            throw new Error('Product assignment not found');
        }
        addPermission.permissions[0].edit = true;
        await this.repo.save(addPermission);
        return new common_response_1.CommonResponse(true, 200, 'Permission details fetched successfully', addPermission);
    }
    async getStaffPermissions(req) {
        const data = await this.repo.getStaffPermissions(req);
        if (!data) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", data);
        }
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permissions_adapter_1.PermissionAdapter,
        permissions_repo_1.PermissionRepository,
        staff_repo_1.StaffRepository,
        designation_service_1.DesignationService,
        designation_repo_1.DesignationRepository])
], PermissionsService);
//# sourceMappingURL=permissions.services.js.map