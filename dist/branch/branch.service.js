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
exports.BranchService = void 0;
const common_1 = require("@nestjs/common");
const branch_repo_1 = require("./repo/branch.repo");
const branch_adapter_1 = require("./branch.adapter");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const path_1 = require("path");
const fs_1 = require("fs");
const staff_entity_1 = require("../staff/entity/staff.entity");
let BranchService = class BranchService {
    constructor(adapter, branchRepo) {
        this.adapter = adapter;
        this.branchRepo = branchRepo;
    }
    async saveBranchDetails(dto) {
        try {
            const internalMessage = dto.id
                ? 'Branch Details Updated Successfully'
                : 'Branch Details Created Successfully';
            const convertDto = this.adapter.convertBranchDtoToEntity(dto);
            await this.branchRepo.save(convertDto);
            return new common_response_1.CommonResponse(true, 65152, internalMessage);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5416, error.message);
        }
    }
    async deleteBranchDetails(dto) {
        try {
            const branchExists = await this.branchRepo.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!branchExists) {
                throw new error_response_1.ErrorResponse(404, `Branch with ID ${dto.id} does not exist`);
            }
            await this.branchRepo.delete(dto.id);
            return new common_response_1.CommonResponse(true, 65153, 'Branch Details Deleted Successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5417, error.message);
        }
    }
    async getBranchDetails(req) {
        try {
            const branches = await this.branchRepo.find({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staff'],
            });
            if (branches.length === 0) {
                return new common_response_1.CommonResponse(false, 404, 'No Branches Found');
            }
            const data = branches.map(branch => {
                const manager = branch.staff.find((staff) => staff.designation === staff_entity_1.DesignationEnum.BranchManager);
                return {
                    branchId: branch.id,
                    branchName: branch.branchName,
                    managerName: manager ? manager.name : 'No Manager Assigned',
                    address: `${branch.addressLine1 || ''}, ${branch.addressLine2 || ''}, ${branch.city}, ${branch.state}, ${branch.pincode}`,
                    branchOpening: branch.branchOpening,
                    email: branch.email,
                    companyCode: branch.companyCode,
                    unitCode: branch.unitCode
                };
            });
            return new common_response_1.CommonResponse(true, 200, 'Branches Retrieved Successfully', data);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getBranchNamesDropDown() {
        const data = await this.branchRepo.find({ select: ['branchName', 'id', 'branchNumber'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No branch names");
        }
    }
    async uploadBranchPhoto(branchId, photo) {
        try {
            const Branch = await this.branchRepo.findOne({ where: { id: branchId } });
            if (!Branch) {
                return new common_response_1.CommonResponse(false, 404, 'Branch not found');
            }
            const filePath = (0, path_1.join)(__dirname, '../../uploads/Branch_photos', `${branchId}-${Date.now()}.jpg`);
            await fs_1.promises.writeFile(filePath, photo.buffer);
            Branch.branchPhoto = filePath;
            await this.branchRepo.save(Branch);
            return new common_response_1.CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.BranchService = BranchService;
exports.BranchService = BranchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [branch_adapter_1.BranchAdapter,
        branch_repo_1.BranchRepository])
], BranchService);
//# sourceMappingURL=branch.service.js.map