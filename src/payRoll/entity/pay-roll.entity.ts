import { StaffEntity } from 'src/staff/entity/staff.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'payrolls' })
export class PayrollEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    staffId: string;

    @Column({ type: 'varchar', length: 255 })
    staffName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    branch: string;

    @Column({ type: 'varchar', length: 255 })
    designation: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    staffPhoto: string;

    @Column({ type: 'int', nullable: true })
    year: number;

    @Column({ type: 'int', nullable: true })
    month: number;

    @Column({ type: 'int', default: 0 })
    monthDays: number;

    @Column({ type: 'int', default: 0 })
    presentDays: number;

    @Column({ type: 'int', default: 0 })
    leaveDays: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    actualSalary: number;

    @Column({ type: 'int', default: 0 })
    totalEarlyMinutes: number;

    @Column({ type: 'int', default: 0 })
    totalLateMinutes: number;

    @Column({ type: 'int', default: 0 })
    lateDays: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    perDaySalary: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    perHourSalary: number;

    @Column({ type: 'int', default: 0 })
    totalOTHours: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    OTAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    lateDeductions: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    grossSalary: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    ESIC_Employee: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    ESIC_Employer: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    PF_Employee: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    PF_Employer1: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    PF_Employer2: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    extraHalfSalary: number;

    @Column({ type: 'int', default: 0 })
    daysOutLate6HoursOrMore: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    netSalary: number;

    @Column({ type: 'varchar', length: 50, default: 'Pending' })
    salaryStatus: string;

    @Column({ type: 'int', default: 0 })
    carryForwardLeaves: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    professionalTax: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    incentives: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    foodAllowance: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    leaveEncashment: number;

    @Column({ type: 'decimal', default: false })
    plBikeNeedToPay: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    plBikeAmount: number;
}
