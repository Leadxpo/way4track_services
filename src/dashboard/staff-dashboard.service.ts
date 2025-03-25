import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { PayrollDto } from "src/payRoll/dto/payroll.dto";
import { SalaryStatus } from "src/payRoll/entity/pay-roll.entity";
import { PayrollService } from "src/payRoll/pay-roll.service";
import { PayrollRepository } from "src/payRoll/repo/payroll.repo";
import { StaffAttendanceQueryDto } from "src/staff/dto/staff-date.dto";
import { StaffSearchDto } from "src/staff/dto/staff-search.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";

@Injectable()
export class StaffDashboardService {

    constructor(
        @InjectRepository(StaffRepository)
        private staffRepository: StaffRepository,
        private service: PayrollService,
        private payrollRepo: PayrollRepository
    ) { }

    async payRoll(req: { branch?: string; companyCode: string; unitCode: string, date: string }): Promise<CommonResponse> {
        const staffData = await this.staffRepository.payRoll(req);

        if (!staffData || staffData.length === 0) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }

        // Extract year and month from the first staff record
        const { year, month } = staffData[0] || {};
        if (!year || !month) {
            return new CommonResponse(false, 400, "Invalid Salary Details", []);
        }

        // Fetch existing payroll data
        const existingPayrollRecords = await this.payrollRepo.find({
            where: { year, month },
        });

        // Convert existing payroll records into a Map (staffId -> record) for easy lookup
        const existingPayrollMap = new Map(existingPayrollRecords.map(record => [record.staffId, record]));

        // If payroll data already exists for all staff, return
        if (existingPayrollRecords.length === staffData.length) {
            return new CommonResponse(true, 200, "Payroll data already exists", existingPayrollRecords);
        }

        // Remove duplicate staff entries
        const uniqueStaffData = Array.from(new Map(staffData.map(record => [record.staffId, record])).values());

        // Filter only new staff who are not in existing payroll
        const newPayrollEntries: PayrollDto[] = uniqueStaffData
            .filter(record => !existingPayrollMap.has(record.staffId))
            .map(record => ({
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
                totalEarlyMinutes: record.totalEarlyMinutes,
                totalLateMinutes: record.totalLateMinutes,
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
                salaryStatus: SalaryStatus.PAID,
                carryForwardLeaves: 0,
                professionalTax: 0,
                incentives: 0,
                foodAllowance: 0,
                leaveEncashment: 0,
                plBikeNeedToPay: 0,
                plBikeAmount: 0,
                payableAmount: 0,
                adavnceAmount: 0
            }));

        // Save only new payroll entries
        if (newPayrollEntries.length > 0) {
            await this.service.createOrUpdatePayroll(newPayrollEntries);
        }

        return new CommonResponse(true, 200, "Payroll processed successfully", [...staffData, ...newPayrollEntries]);
    }




    async staffAttendanceDetails(req: StaffAttendanceQueryDto) {
        const staffData = await this.staffRepository.staffAttendanceDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async getStaffSearchDetails(req: StaffSearchDto) {
        const staffData = await this.staffRepository.getStaffSearchDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async getStaff(req: CommonReq) {
        const staffData = await this.staffRepository.getStaff(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async getStaffCardsDetails(req: StaffSearchDto) {
        const staffData = await this.staffRepository.getStaffCardsDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async getTotalStaffDetails(req: StaffSearchDto) {
        const staffData = await this.staffRepository.getTotalStaffDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async getBranchStaffDetails(req: StaffSearchDto) {
        const staffData = await this.staffRepository.getBranchStaffDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async getAllBranchStaffDetails(req: StaffSearchDto) {
        const staffData = await this.staffRepository.getAllBranchStaffDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }
}