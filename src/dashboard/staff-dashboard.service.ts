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
    async payRoll(req: { branch?: string; companyCode: string; unitCode: string }): Promise<CommonResponse> {
        const staffData = await this.staffRepository.payRoll(req);

        if (!staffData || staffData.length === 0) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }

        // Extract year and month from staff data
        const { year, month } = staffData[0]?.salaryDetails[0] || {};
        if (!year || !month) {
            return new CommonResponse(false, 400, "Invalid Salary Details", []);
        }

        // Fetch existing payroll data
        const existingPayrollRecords = await this.payrollRepo.find({
            where: {
                year,
                month,
            },
        });
        // Convert existing payroll records into a map for easy lookup
        const existingPayrollMap = new Map(existingPayrollRecords.map(record => [record.staffId, record]));

        // Prepare payroll entries (new or updated)
        const payrollEntries: PayrollDto[] = staffData.map(record => {
            const existingPayroll = existingPayrollMap.get(record.staffId);

            const payrollEntry: PayrollDto = {
                staffId: record.staffId,
                staffName: record.staffName,
                branch: record.branch,
                designation: record.designation,
                staffPhoto: record.staffPhoto,
                year,
                month,
                monthDays: record.salaryDetails[0]?.monthDays,
                presentDays: record.salaryDetails[0]?.presentDays,
                leaveDays: record.salaryDetails[0]?.leaveDays,
                actualSalary: record.salaryDetails[0]?.actualSalary,
                totalEarlyMinutes: record.salaryDetails[0]?.totalEarlyMinutes,
                totalLateMinutes: record.salaryDetails[0]?.totalLateMinutes,
                lateDays: record.salaryDetails[0]?.lateDays,
                perDaySalary: record.salaryDetails[0]?.perDaySalary,
                perHourSalary: record.salaryDetails[0]?.perHourSalary,
                totalOTHours: record.salaryDetails[0]?.totalOTHours,
                OTAmount: record.salaryDetails[0]?.OTAmount,
                lateDeductions: record.salaryDetails[0]?.lateDeductions,
                grossSalary: record.salaryDetails[0]?.grossSalary,
                ESIC_Employee: record.salaryDetails[0]?.ESIC_Employee,
                ESIC_Employer: record.salaryDetails[0]?.ESIC_Employer,
                PF_Employee: record.salaryDetails[0]?.PF_Employee,
                PF_Employer1: record.salaryDetails[0]?.PF_Employer1,
                PF_Employer2: record.salaryDetails[0]?.PF_Employer2,
                extraHalfSalary: record.salaryDetails[0]?.extraHalfSalary,
                daysOutLate6HoursOrMore: record.salaryDetails[0]?.daysOutLate6HoursOrMore,
                netSalary: record.salaryDetails[0]?.netSalary,
                salaryStatus: existingPayroll.salaryStatus || SalaryStatus.PAID,
                carryForwardLeaves: existingPayroll?.carryForwardLeaves ?? 0, // Preserve previous value if exists
                professionalTax: existingPayroll?.professionalTax ?? 0,
                incentives: existingPayroll?.incentives ?? 0,
                foodAllowance: existingPayroll?.foodAllowance ?? 0,
                leaveEncashment: existingPayroll?.leaveEncashment ?? 0,
                plBikeNeedToPay: existingPayroll?.plBikeNeedToPay ?? 0,
                plBikeAmount: existingPayroll?.plBikeAmount ?? 0,
            };

            return payrollEntry;
        });
        // Save or update payroll records
        await this.service.createOrUpdatePayroll(payrollEntries);

        return new CommonResponse(true, 200, "Payroll processed successfully", payrollEntries);
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