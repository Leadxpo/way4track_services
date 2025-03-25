import { PayrollDto } from "./dto/payroll.dto";
import { PayrollEntity } from "./entity/pay-roll.entity";


export class PayrollAdapter {
    toEntity(dtoArray: PayrollDto[]): PayrollEntity[] {
        return dtoArray.map(dto => {
            const entity = new PayrollEntity();
            Object.assign(entity, dto);
            return entity;
        });
    }
    

     toDto(entity: PayrollEntity): PayrollDto {
        return {
            staffId: entity.staffId,
            staffName: entity.staffName,
            branch: entity.branch,
            designation: entity.designation,
            staffPhoto: entity.staffPhoto,
            year: entity.year,
            month: entity.month,
            monthDays: entity.monthDays,
            presentDays: entity.presentDays,
            leaveDays: entity.leaveDays,
            actualSalary: entity.actualSalary,
            totalEarlyMinutes: entity.totalEarlyMinutes,
            totalLateMinutes: entity.totalLateMinutes,
            lateDays: entity.lateDays,
            perDaySalary: entity.perDaySalary,
            perHourSalary: entity.perHourSalary,
            totalOTHours: entity.totalOTHours,
            OTAmount: entity.OTAmount,
            lateDeductions: entity.lateDeductions,
            grossSalary: entity.grossSalary,
            ESIC_Employee: entity.ESIC_Employee,
            ESIC_Employer: entity.ESIC_Employer,
            PF_Employee: entity.PF_Employee,
            PF_Employer1: entity.PF_Employer1,
            PF_Employer2: entity.PF_Employer2,
            extraHalfSalary: entity.extraHalfSalary,
            daysOutLate6HoursOrMore: entity.daysOutLate6HoursOrMore,
            netSalary: entity.netSalary,
            salaryStatus: entity.salaryStatus,
            carryForwardLeaves: entity.carryForwardLeaves,
            professionalTax: entity.professionalTax,
            incentives: entity.incentives,
            foodAllowance: entity.foodAllowance,
            leaveEncashment: entity.leaveEncashment,
            plBikeNeedToPay: entity.plBikeNeedToPay,
            plBikeAmount: entity.plBikeAmount,
            payableAmount:entity.payableAmount,
            adavnceAmount:entity.adavnceAmount,

        };
    }
}
