import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceStatus } from 'src/staff/enum/attendence-status.enum';
@Entity('attendances')
export class AttendanceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StaffEntity, (staff) => staff.attendance, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'staff_id' })
    staff: StaffEntity;

    @Column({ name: 'staff_name', type: 'varchar', length: 100, nullable: false })
    staffName: string;

    @Column({ name: 'branch_name', type: 'varchar', length: 100, nullable: true })
    branchName: string;

    @Column({ name: 'day', type: 'date', nullable: false })
    day: Date;

    @Column({ name: 'in_time', type: 'varchar', length: 10, nullable: true })
    inTime: string;

    @Column({ name: 'in_time_remark', type: 'varchar', length: 255, nullable: true })
    inTimeRemark: string;

    @Column({ name: 'out_time', type: 'varchar', length: 10, nullable: true })
    outTime: string;

    @Column({ name: 'out_time_remark', type: 'varchar', length: 255, nullable: true })
    outTimeRemark: string;

    @Column({ name: 'remark', type: 'varchar', length: 255, nullable: true })
    remark: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: AttendanceStatus,
        default: AttendanceStatus.PRESENT,
    })
    status: AttendanceStatus;
}



