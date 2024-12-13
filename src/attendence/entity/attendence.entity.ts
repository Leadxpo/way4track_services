import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceStatus } from 'src/staff/enum/attendence-status.enum';

@Entity('attendance')
export class AttendanceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'day', type: 'date' })
    day: Date;

    @Column({ name: 'in_time', type: 'datetime', nullable: true })
    inTime: Date;

    @Column({ name: 'out_time', type: 'datetime', nullable: true })
    outTime: Date;

    @Column({
        name: 'status',
        type: 'enum',
        enum: AttendanceStatus,
        nullable: false,
    })
    status: AttendanceStatus;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.staffId)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.attendance)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;
}
