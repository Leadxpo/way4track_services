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
exports.StaffDashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_response_1 = require("../models/common-response");
const pay_roll_entity_1 = require("../payRoll/entity/pay-roll.entity");
const pay_roll_service_1 = require("../payRoll/pay-roll.service");
const payroll_repo_1 = require("../payRoll/repo/payroll.repo");
const staff_repo_1 = require("../staff/repo/staff-repo");
let StaffDashboardService = class StaffDashboardService {
    constructor(staffRepository, service, payrollRepo) {
        this.staffRepository = staffRepository;
        this.service = service;
        this.payrollRepo = payrollRepo;
    }
    async payRoll(req) {
        const staffData = await this.staffRepository.payRoll(req);
        if (!staffData || staffData.length === 0) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        const { year, month } = staffData[0] || {};
        if (!year || !month) {
            return new common_response_1.CommonResponse(false, 400, "Invalid Salary Details", []);
        }
        const existingPayrollRecords = await this.payrollRepo.find({
            where: { year, month },
        });
        const existingPayrollMap = new Map(existingPayrollRecords.map(record => [record.staffId, record]));
        const uniqueStaffData = Array.from(new Map(staffData.map(record => [record.staffId, record])).values());
        const newPayrollEntries = [];
        const updatedPayrollEntries = [];
        for (const record of uniqueStaffData) {
            const existing = existingPayrollMap.get(record.staffId);
            const basePayroll = {
                staffId: record.staffId,
                staffName: record.staffName,
                branch: record.branch,
                designation: record.designation,
                staffPhoto: record.staffPhoto,
                year,
                month,
                monthDays: record.monthDays,
                presentDays: record.presentDays,
                leaveDays: record.leaveDays,
                actualSalary: record.actualSalary,
                totalEarlyHours: record.totalEarlyHours,
                totalLateHours: record.totalLateHours,
                lateDays: record.lateDays,
                perDaySalary: record.perDaySalary,
                perHourSalary: record.perHourSalary,
                totalOTHours: record.totalOTHours,
                OTAmount: record.OTAmount,
                lateDeductions: record.lateDeductions,
                grossSalary: record.grossSalary,
                ESIC_Employee: record.ESIC_Employee,
                ESIC_Employer: record.ESIC_Employer,
                PF_Employee: record.PF_Employee,
                PF_Employer1: record.PF_Employer1,
                PF_Employer2: record.PF_Employer2,
                extraHalfSalary: record.extraHalfSalary,
                daysOutLate6HoursOrMore: record.daysOutLate6HoursOrMore,
                netSalary: record.netSalary,
                salaryStatus: pay_roll_entity_1.SalaryStatus.PAID,
                carryForwardLeaves: record.carryForwardLeaves || 0,
                professionalTax: 0,
                incentives: 0,
                foodAllowance: 0,
                leaveEncashment: 0,
                plBikeNeedToPay: 0,
                plBikeAmount: 0,
                payableAmount: 0,
                adavnceAmount: 0,
            };
            if (!existing) {
                newPayrollEntries.push(basePayroll);
            }
            else {
                const hasChanges = record.presentDays !== existing.presentDays ||
                    record.leaveDays !== existing.leaveDays ||
                    record.totalLateHours !== existing.totalLateHours ||
                    record.totalEarlyHours !== existing.totalEarlyHours ||
                    record.lateDeductions !== existing.lateDeductions ||
                    record.grossSalary !== existing.grossSalary ||
                    record.netSalary !== existing.netSalary ||
                    record.extraHalfSalary !== existing.extraHalfSalary ||
                    record.daysOutLate6HoursOrMore !== existing.daysOutLate6HoursOrMore;
                if (hasChanges) {
                    updatedPayrollEntries.push({ ...existing, ...basePayroll });
                }
            }
        }
        const allToSave = [...newPayrollEntries, ...updatedPayrollEntries];
        if (allToSave.length > 0) {
            await this.service.createOrUpdatePayroll(allToSave);
        }
        const refreshedPayroll = await this.payrollRepo.find({
            where: { year, month },
        });
        return new common_response_1.CommonResponse(true, 200, "Payroll processed successfully", refreshedPayroll);
    }
    async staffAttendanceDetails(req) {
        const staffData = await this.staffRepository.staffAttendanceDetails(req);
        if (!staffData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", staffData);
        }
    }
    async getStaffSearchDetails(req) {
        const staffData = await this.staffRepository.getStaffSearchDetails(req);
        if (!staffData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", staffData);
        }
    }
    async getStaff(req) {
        const staffData = await this.staffRepository.getStaff(req);
        if (!staffData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", staffData);
        }
    }
    async getStaffCardsDetails(req) {
        const staffData = await this.staffRepository.getStaffCardsDetails(req);
        if (!staffData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", staffData);
        }
    }
    async getTotalStaffDetails(req) {
        const staffData = await this.staffRepository.getTotalStaffDetails(req);
        if (!staffData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", staffData);
        }
    }
    async getBranchStaffDetails(req) {
        const staffData = await this.staffRepository.getBranchStaffDetails(req);
        if (!staffData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", staffData);
        }
    }
    async getAllBranchStaffDetails(req) {
        const staffData = await this.staffRepository.getAllBranchStaffDetails(req);
        if (!staffData) {
            return new common_response_1.CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Data retrieved successfully", staffData);
        }
    }
};
exports.StaffDashboardService = StaffDashboardService;
exports.StaffDashboardService = StaffDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_repo_1.StaffRepository)),
    __metadata("design:paramtypes", [staff_repo_1.StaffRepository,
        pay_roll_service_1.PayrollService,
        payroll_repo_1.PayrollRepository])
], StaffDashboardService);
//# sourceMappingURL=staff-dashboard.service.js.map