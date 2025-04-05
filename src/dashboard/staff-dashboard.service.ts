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

    // async payRoll(req: { branch?: string; companyCode: string; unitCode: string; date: string }): Promise<CommonResponse> {
    //     const staffData = await this.staffRepository.payRoll(req);

    //     if (!staffData || staffData.length === 0) {
    //         return new CommonResponse(false, 56416, "Data Not Found With Given Input", []);
    //     }

    //     // Extract year and month from the first staff record
    //     const { year, month } = staffData[0] || {};
    //     if (!year || !month) {
    //         return new CommonResponse(false, 400, "Invalid Salary Details", []);
    //     }

    //     // Fetch existing payroll records
    //     const existingPayrollRecords = await this.payrollRepo.find({
    //         where: { year, month },
    //     });

    //     // Map of existing payrolls by staffId for quick access
    //     const existingPayrollMap = new Map(existingPayrollRecords.map(record => [record.staffId, record]));

    //     // Remove duplicates from staff data
    //     const uniqueStaffData = Array.from(new Map(staffData.map(record => [record.staffId, record])).values());

    //     // Identify new staff not in payroll yet
    //     const newPayrollEntries: PayrollDto[] = uniqueStaffData
    //         .filter(record => !existingPayrollMap.has(record.staffId))
    //         .map(record => ({
    //             staffId: record.staffId,
    //             staffName: record.staffName,
    //             branch: record.branch,
    //             designation: record.designation,
    //             staffPhoto: record.staffPhoto,
    //             year,
    //             month,
    //             monthDays: record.monthDays,
    //             presentDays: record.presentDays,
    //             leaveDays: record.leaveDays,
    //             actualSalary: record.actualSalary,
    //             totalEarlyHours: record.totalEarlyHours,
    //             totalLateHours: record.totalLateHours,
    //             lateDays: record.lateDays,
    //             perDaySalary: record.perDaySalary,
    //             perHourSalary: record.perHourSalary,
    //             totalOTHours: record.totalOTHours,
    //             OTAmount: record.OTAmount,
    //             lateDeductions: record.lateDeductions,
    //             grossSalary: record.grossSalary,
    //             ESIC_Employee: record.ESIC_Employee,
    //             ESIC_Employer: record.ESIC_Employer,
    //             PF_Employee: record.PF_Employee,
    //             PF_Employer1: record.PF_Employer1,
    //             PF_Employer2: record.PF_Employer2,
    //             extraHalfSalary: record.extraHalfSalary,
    //             daysOutLate6HoursOrMore: record.daysOutLate6HoursOrMore,
    //             netSalary: record.netSalary,
    //             salaryStatus: SalaryStatus.PAID,
    //             carryForwardLeaves: record.carryForwardLeaves || 0,
    //             professionalTax: 0,
    //             incentives: 0,
    //             foodAllowance: 0,
    //             leaveEncashment: 0,
    //             plBikeNeedToPay: 0,
    //             plBikeAmount: 0,
    //             payableAmount: 0,
    //             adavnceAmount: 0,
    //         }));

    //     // Save newly created payroll entries
    //     if (newPayrollEntries.length > 0) {
    //         await this.service.createOrUpdatePayroll(newPayrollEntries);
    //     }

    //     // Merge saved payroll data (updated from DB) with latest calculated data
    //     const mergedPayroll = uniqueStaffData.map(calculated => {
    //         const saved = existingPayrollMap.get(calculated.staffId);
    //         return {
    //             ...saved,
    //             ...calculated,
    //         };
    //     });

    //     // Include the newly inserted entries
    //     const allMerged = [...mergedPayroll, ...newPayrollEntries];

    //     return new CommonResponse(true, 200, "Payroll processed successfully", allMerged);
    // }

    async payRoll(req: { branch?: string; companyCode: string; unitCode: string; date: string }): Promise<CommonResponse> {
        const staffData = await this.staffRepository.payRoll(req);

        if (!staffData || staffData.length === 0) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", []);
        }

        const { year, month } = staffData[0] || {};
        if (!year || !month) {
            return new CommonResponse(false, 400, "Invalid Salary Details", []);
        }

        const existingPayrollRecords = await this.payrollRepo.find({
            where: { year, month },
        });

        const existingPayrollMap = new Map(existingPayrollRecords.map(record => [record.staffId, record]));
        const uniqueStaffData = Array.from(new Map(staffData.map(record => [record.staffId, record])).values());

        const newPayrollEntries: PayrollDto[] = [];
        const updatedPayrollEntries: PayrollDto[] = [];

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
                salaryStatus: SalaryStatus.PAID,
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
            } else {
                const hasChanges =
                    record.presentDays !== existing.presentDays ||
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

        return new CommonResponse(true, 200, "Payroll processed successfully", refreshedPayroll);
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