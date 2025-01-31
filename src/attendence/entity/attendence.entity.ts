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

    @Column({ type: 'json', nullable: true })
    timeRecords: { inTime: Date; outTime: Date }[];

    @Column({
        name: 'status',
        type: 'enum',
        enum: AttendanceStatus,
        default: AttendanceStatus.PRESENT
    })
    status: AttendanceStatus;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.staffId)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.attendance)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
