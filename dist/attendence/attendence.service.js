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
exports.AttendanceService = void 0;
const XLSX = require("xlsx");
const common_1 = require("@nestjs/common");
const attendence_entity_1 = require("./entity/attendence.entity");
const attendence_repo_1 = require("./repo/attendence.repo");
const staff_repo_1 = require("../staff/repo/staff-repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const attendence_adapter_1 = require("./attendence.adapter");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepo, adapter, staffRepo) {
        this.attendanceRepo = attendanceRepo;
        this.adapter = adapter;
        this.staffRepo = staffRepo;
    }
    async processAttendanceExcel(file) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(data, "data");
        const attendanceRecords = [];
        const missingStaffIds = [];
        for (const row of data) {
            const staffId = row['Staff ID'];
            const staffName = row['Name'];
            const branchName = row['Branch Name'];
            const monthYear = row['Month-Year'];
            if (!monthYear)
                continue;
            const [year, month] = monthYear.split('-').map(Number);
            const daysInMonth = new Date(year, month, 0).getDate();
            const staff = await this.staffRepo.findOne({ where: { staffId } });
            if (!staff) {
                missingStaffIds.push(staffId);
                continue;
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const inTimeField = `Day ${day} IN TIME`;
                const inTimeRemarkField = `Day ${day} IN TIME Remarks`;
                const outTimeField = `Day ${day} OUT TIME`;
                const outTimeRemarkField = `Day ${day} OUT TIME Remarks`;
                const statusField = `Day ${day} Status`;
                const remarksField = `Day ${day} Remarks`;
                if (row[inTimeField] || row[outTimeField]) {
                    const date = new Date(year, month - 1, day);
                    const actualInTime = row[inTimeField] || null;
                    const actualOutTime = row[outTimeField] || null;
                    const inTimeRemark = row[inTimeRemarkField] || null;
                    const outTimeRemark = row[outTimeRemarkField] || null;
                    const status = row[statusField];
                    const remarks = row[remarksField] || "";
                    const existingRecord = await this.attendanceRepo.findOne({
                        where: { staff: { id: staff.id }, day: date },
                    });
                    if (existingRecord) {
                        existingRecord.inTime = actualInTime || existingRecord.inTime;
                        existingRecord.inTimeRemark = inTimeRemark || existingRecord.inTimeRemark;
                        existingRecord.outTime = actualOutTime || existingRecord.outTime;
                        existingRecord.outTimeRemark = outTimeRemark || existingRecord.outTimeRemark;
                        existingRecord.status = status || existingRecord.status;
                        existingRecord.remark = remarks || existingRecord.remark;
                        await this.attendanceRepo.save(existingRecord);
                    }
                    else {
                        const attendance = new attendence_entity_1.AttendanceEntity();
                        attendance.staff = staff;
                        attendance.staffName = staffName;
                        attendance.branchName = branchName;
                        attendance.day = date;
                        attendance.inTime = actualInTime;
                        attendance.inTimeRemark = inTimeRemark;
                        attendance.outTime = actualOutTime;
                        attendance.outTimeRemark = outTimeRemark;
                        attendance.status = status;
                        attendance.remark = remarks;
                        attendanceRecords.push(attendance);
                    }
                }
            }
        }
        if (attendanceRecords.length > 0) {
            await this.attendanceRepo.save(attendanceRecords);
        }
        console.log(attendanceRecords, "attendanceRecords");
        return {
            message: 'Attendance data uploaded successfully',
            inserted: attendanceRecords.length,
            missingStaffIds: missingStaffIds.length > 0 ? missingStaffIds : 'None'
        };
    }
    async updateAttendanceDetails(dto) {
        try {
            let existingAttendance = null;
            if (dto.id) {
                existingAttendance = await this.attendanceRepo.findOne({ where: { id: dto.id } });
            }
            if (!existingAttendance) {
                throw new Error('Attendance not found');
            }
            const entity = this.adapter.toEntity(dto);
            console.log(entity, "????????");
            const updatedAttendance = {
                ...existingAttendance,
                ...entity,
                staff: entity.staff ?? existingAttendance.staff
            };
            console.log('Updated Attendance payload:', updatedAttendance);
            await this.attendanceRepo.save(updatedAttendance);
            return new common_response_1.CommonResponse(true, 200, 'Attendance details updated successfully');
        }
        catch (error) {
            console.error(`Error updating Attendance details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to update Attendance details: ${error.message}`);
        }
    }
    async getAttendanceDetailsById(req) {
        try {
            console.log(req, "+++++++++++");
            const Attendance = await this.attendanceRepo.findOne({ relations: ['staff'], where: { id: req.id } });
            console.log(Attendance, "+++++++++++");
            if (!Attendance) {
                return new common_response_1.CommonResponse(false, 404, 'Attendance not found');
            }
            else {
                return new common_response_1.CommonResponse(true, 200, 'Attendance details fetched successfully', Attendance);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getAttendanceDetails() {
        try {
            const attendanceRecords = await this.attendanceRepo.find({ relations: ['staff'] });
            if (!attendanceRecords.length) {
                return new common_response_1.CommonResponse(false, 404, 'Attendance not found');
            }
            const data = attendanceRecords.map(record => this.adapter.toDto(record));
            return new common_response_1.CommonResponse(true, 200, 'Attendance details fetched successfully', data);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getStaffAttendance(req) {
        const branch = await this.attendanceRepo.getStaffAttendance(req);
        if (!branch.length) {
            return new common_response_1.CommonResponse(false, 35416, "There Is No List");
        }
        else {
            return new common_response_1.CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendence_repo_1.AttendenceRepository,
        attendence_adapter_1.AttendanceAdapter,
        staff_repo_1.StaffRepository])
], AttendanceService);
//# sourceMappingURL=attendence.service.js.map