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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const staff_adaptert_1 = require("./staff.adaptert");
const staff_repo_1 = require("./repo/staff-repo");
const path_1 = require("path");
const fs_1 = require("fs");
const attendence_entity_1 = require("../attendence/entity/attendence.entity");
const attendence_repo_1 = require("../attendence/repo/attendence.repo");
const branch_entity_1 = require("../branch/entity/branch.entity");
let StaffService = class StaffService {
    constructor(adapter, staffRepository, attendanceRepo) {
        this.adapter = adapter;
        this.staffRepository = staffRepository;
        this.attendanceRepo = attendanceRepo;
    }
    async saveAttendanceDetails(attendanceDetails, staff, branchId) {
        const attendance = new attendence_entity_1.AttendanceEntity();
        attendance.day = attendanceDetails.day;
        attendance.inTime = attendanceDetails.inTime;
        attendance.outTime = attendanceDetails.outTime;
        attendance.status = attendanceDetails.status;
        attendance.staffId = staff;
        const branch = new branch_entity_1.BranchEntity();
        branch.id = branchId;
        attendance.branchId = branch;
        return await this.attendanceRepo.save(attendance);
    }
    async updateStaffDetails(req) {
        try {
            const existingStaff = await this.staffRepository.findOne({
                where: { id: req.id, staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode },
            });
            if (!existingStaff) {
                return new common_response_1.CommonResponse(false, 4002, 'Staff not found for the provided id.');
            }
            Object.assign(existingStaff, this.adapter.convertDtoToEntity(req));
            await this.staffRepository.save(existingStaff);
            if (req.attendanceDetails) {
                const savedAttendance = await this.saveAttendanceDetails(req.attendanceDetails, existingStaff, req.branchId);
                if (!existingStaff.attendance) {
                    existingStaff.attendance = [];
                }
                existingStaff.attendance.push(savedAttendance);
                await this.staffRepository.save(existingStaff);
            }
            return new common_response_1.CommonResponse(true, 65152, 'Staff Details Updated Successfully');
        }
        catch (error) {
            console.error(`Error updating staff details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to update staff details: ${error.message}`);
        }
    }
    async createStaffDetails(req) {
        try {
            const newStaff = this.adapter.convertDtoToEntity(req);
            newStaff.staffId = `SF-${(await this.staffRepository.count() + 1).toString().padStart(5, '0')}`;
            await this.staffRepository.save(newStaff);
            if (req.attendanceDetails) {
                const savedAttendance = await this.saveAttendanceDetails(req.attendanceDetails, newStaff, req.branchId);
                newStaff.attendance = [savedAttendance];
                await this.staffRepository.save(newStaff);
            }
            return new common_response_1.CommonResponse(true, 65152, 'Staff Details Created Successfully');
        }
        catch (error) {
            console.error(`Error creating staff details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(5416, `Failed to create staff details: ${error.message}`);
        }
    }
    async handleStaffDetails(req) {
        if (req.id || req.staffId) {
            return await this.updateStaffDetails(req);
        }
        else {
            return await this.createStaffDetails(req);
        }
    }
    async deleteStaffDetails(dto) {
        try {
            const staffExists = await this.staffRepository.findOne({ where: { staffId: dto.staffId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!staffExists) {
                throw new error_response_1.ErrorResponse(404, `staff with staffId ${dto.staffId} does not exist`);
            }
            await this.staffRepository.delete(dto.staffId);
            return new common_response_1.CommonResponse(true, 65153, 'staff Details Deleted Successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(5417, error.message);
        }
    }
    async getStaffDetails(req) {
        try {
            const staff = await this.staffRepository.find({
                relations: ['branch'],
                where: { staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode },
            });
            if (!staff.length) {
                return new common_response_1.CommonResponse(false, 404, 'staff not found');
            }
            else {
                const data = this.adapter.convertEntityToDto(staff);
                return new common_response_1.CommonResponse(true, 200, 'staff details fetched successfully', data);
            }
        }
        catch (error) {
            console.error("Error in getstaffDetails service:", error);
            return new common_response_1.CommonResponse(false, 500, 'Error fetching staff details');
        }
    }
    async getStaffNamesDropDown() {
        const data = await this.staffRepository.find({ select: ['name', 'id', 'staffId'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No staff names");
        }
    }
    async uploadStaffPhoto(staffId, photo) {
        try {
            const staff = await this.staffRepository.findOne({ where: { id: staffId } });
            if (!staff) {
                return new common_response_1.CommonResponse(false, 404, 'staff not found');
            }
            const filePath = (0, path_1.join)(__dirname, '../../uploads/staff_photos', `${staffId}-${Date.now()}.jpg`);
            await fs_1.promises.writeFile(filePath, photo.buffer);
            staff.staffPhoto = filePath;
            await this.staffRepository.save(staff);
            return new common_response_1.CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [staff_adaptert_1.StaffAdapter,
        staff_repo_1.StaffRepository,
        attendence_repo_1.AttendenceRepository])
], StaffService);
//# sourceMappingURL=staff-services.js.map