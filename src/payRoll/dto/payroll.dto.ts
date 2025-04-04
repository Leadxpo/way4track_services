import { SalaryStatus } from "../entity/pay-roll.entity";

export class PayrollDto {
    id?: number
    staffId: string;
    staffName: string;
    branch?: string;
    designation: string;
    staffPhoto?: string;
    year?: number;
    month?: number;
    monthDays: number;
    presentDays: number;
    leaveDays: number;
    actualSalary: number;
    totalEarlyHours: number;
    totalLateHours: number;
    lateDays: number;
    perDaySalary?: number;
    perHourSalary?: number;
    totalOTHours: number;
    OTAmount?: number;
    lateDeductions?: number;
    grossSalary?: number;
    ESIC_Employee?: number;
    ESIC_Employer?: number;
    PF_Employee?: number;
    PF_Employer1?: number;
    PF_Employer2?: number;
    extraHalfSalary?: number;
    daysOutLate6HoursOrMore: number;
    netSalary?: number;
    salaryStatus: SalaryStatus;
    carryForwardLeaves: number;
    professionalTax?: number;
    incentives?: number;
    foodAllowance?: number;
    leaveEncashment?: number;
    plBikeNeedToPay?: number;
    plBikeAmount?: number;
    payableAmount: number;
    adavnceAmount: number;

}
