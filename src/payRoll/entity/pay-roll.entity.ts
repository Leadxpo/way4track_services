import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
export enum SalaryStatus {
    PAID = 'Paid',
    HOLD = 'Hold',
    OTHER = 'Other Reason',
}
@Entity({ name: 'payrolls' })
export class PayrollEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'staff_id', type: 'varchar', length: 255 })
    staffId: string;

    @Column({ name: 'staff_name', type: 'varchar', length: 255 })
    staffName: string;

    @Column({ name: 'branch', type: 'varchar', length: 255, nullable: true })
    branch: string;

    @Column({ name: 'designation', type: 'varchar', length: 255 })
    designation: string;

    @Column({ name: 'staff_photo', type: 'varchar', length: 500, nullable: true })
    staffPhoto: string;

    @Column({ name: 'year', type: 'int', nullable: true })
    year: number;

    @Column({ name: 'month', type: 'int', nullable: true })
    month: number;

    @Column({ name: 'month_days', type: 'int', default: 0 })
    monthDays: number;

    @Column({ name: 'present_days', type: 'int', default: 0 })
    presentDays: number;

    @Column({ name: 'leave_days', type: 'int', default: 0 })
    leaveDays: number;

    @Column({ name: 'actual_salary', type: 'decimal', precision: 10, scale: 2 })
    actualSalary: number;

    @Column({ name: 'total_early_minutes', type: 'int', default: 0 })
    totalEarlyMinutes: number;

    @Column({ name: 'total_late_minutes', type: 'int', default: 0 })
    totalLateMinutes: number;

    @Column({ name: 'late_days', type: 'int', default: 0 })
    lateDays: number;

    @Column({ name: 'per_day_salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
    perDaySalary: number;

    @Column({ name: 'per_hour_salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
    perHourSalary: number;

    @Column({ name: 'total_ot_hours', type: 'int', default: 0 })
    totalOTHours: number;

    @Column({ name: 'ot_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
    OTAmount: number;

    @Column({ name: 'late_deductions', type: 'decimal', precision: 10, scale: 2, nullable: true })
    lateDeductions: number;

    @Column({ name: 'gross_salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
    grossSalary: number;

    @Column({ name: 'esic_employee', type: 'decimal', precision: 10, scale: 2, nullable: true })
    ESIC_Employee: number;

    @Column({ name: 'esic_employer', type: 'decimal', precision: 10, scale: 2, nullable: true })
    ESIC_Employer: number;

    @Column({ name: 'pf_employee', type: 'decimal', precision: 10, scale: 2, nullable: true })
    PF_Employee: number;

    @Column({ name: 'pf_employer_1', type: 'decimal', precision: 10, scale: 2, nullable: true })
    PF_Employer1: number;

    @Column({ name: 'pf_employer_2', type: 'decimal', precision: 10, scale: 2, nullable: true })
    PF_Employer2: number;

    @Column({ name: 'extra_half_salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
    extraHalfSalary: number;

    @Column({ name: 'days_out_late_6_hours_or_more', type: 'int', default: 0 })
    daysOutLate6HoursOrMore: number;

    @Column({ name: 'net_salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
    netSalary: number;

    @Column({ name: 'salary_status', type: 'enum', enum: SalaryStatus })
    salaryStatus: SalaryStatus;

    @Column({ name: 'carry_forward_leaves', type: 'int', default: 0 })
    carryForwardLeaves: number;

    @Column({ name: 'professional_tax', type: 'decimal', precision: 10, scale: 2, nullable: true })
    professionalTax: number;

    @Column({ name: 'incentives', type: 'decimal', precision: 10, scale: 2, nullable: true })
    incentives: number;

    @Column({ name: 'food_allowance', type: 'decimal', precision: 10, scale: 2, nullable: true })
    foodAllowance: number;

    @Column({ name: 'leave_encashment', type: 'decimal', precision: 10, scale: 2, nullable: true })
    leaveEncashment: number;

    @Column({ name: 'pl_bike_need_to_pay', type: 'decimal', default: 0 })
    plBikeNeedToPay: number;

    @Column({ name: 'pl_bike_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
    plBikeAmount: number;
}
