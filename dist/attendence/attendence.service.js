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
const common_1 = require("@nestjs/common");
const attendence_repo_1 = require("./repo/attendence.repo");
const branch_repo_1 = require("../branch/repo/branch.repo");
const staff_repo_1 = require("../staff/repo/staff-repo");
const attendence_adapter_1 = require("./attendence.adapter");
const common_response_1 = require("../models/common-response");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository, staffRepository, adapter, branchRepository) {
        this.attendanceRepository = attendanceRepository;
        this.staffRepository = staffRepository;
        this.adapter = adapter;
        this.branchRepository = branchRepository;
    }
    async saveAttendance(dto) {
        const { id, staffId, branchId, day, inTime, outTime, status, remarks } = dto;
        const staff = await this.staffRepository.findOne({ where: { id: staffId } });
        if (!staff)
            throw new Error('Staff not found');
        const branch = await this.branchRepository.findOne({ where: { id: branchId } });
        if (!branch)
            throw new Error('Branch not found');
        let attendance;
        const internalMessage = id ? 'Attendance Updated Successfully' : 'Attendance Created Successfully';
        if (id) {
            attendance = await this.attendanceRepository.findOne({ where: { id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!attendance)
                throw new Error('Attendance record not found');
            Object.assign(attendance, { staff, branch, day, inTime, outTime, status, remarks });
        }
        else {
            attendance = this.adapter.toEntity(dto);
            attendance.staffId = staff;
            attendance.branchId = branch;
        }
        await this.attendanceRepository.save(attendance);
        return new common_response_1.CommonResponse(true, 65152, internalMessage);
    }
    async getAttendance(staffId, branchId, dateRange, companyCode, unitCode) {
        const query = this.attendanceRepository.createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.staffId', 'staff')
            .leftJoinAndSelect('attendance.branchId', 'branch');
        if (staffId) {
            query.andWhere('attendance.staffId = :staffId', { staffId });
        }
        if (branchId) {
            query.andWhere('attendance.branchId = :branchId', { branchId });
        }
        if (companyCode) {
            query.andWhere('attendance.company_code = :companyCode', { companyCode });
        }
        if (unitCode) {
            query.andWhere('attendance.unit_code = :unitCode', { unitCode });
        }
        if (dateRange) {
            query.andWhere('attendance.day BETWEEN :start AND :end', { start: dateRange.start, end: dateRange.end });
        }
        return query.getMany();
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendence_repo_1.AttendenceRepository,
        staff_repo_1.StaffRepository,
        attendence_adapter_1.AttendanceAdapter,
        branch_repo_1.BranchRepository])
], AttendanceService);
//# sourceMappingURL=attendence.service.js.map