import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceStatus } from 'src/staff/enum/attendence-status.enum';

@Entity('attendances')
export class AttendanceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'day', type: 'date' })
    day: Date;

    @Column({ type: 'json', nullable: true, name: "time_records" })
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

    @Column('varchar', { name: 'staff_name', length: 20, nullable: false })
    staffName: string;

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.attendance)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}


// @Entity('attendances')
// export class AttendanceEntity {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ name: 'day', type: 'date', nullable: false })
//     day: Date;

//     @Column({ name: 'in_time', type: 'varchar', length: 10, nullable: true })
//     inTime: string;

//     @Column({ name: 'out_time', type: 'varchar', length: 10, nullable: true })
//     outTime: string;

//     @Column({ name: 'in_time_remark', type: 'varchar', length: 255, nullable: true })
//     inTimeRemark: string;

//     @Column({ name: 'out_time_remark', type: 'varchar', length: 255, nullable: true })
//     outTimeRemark: string;

//     @Column({
//         name: 'status',
//         type: 'enum',
//         enum: AttendanceStatus,
//         default: AttendanceStatus.PRESENT,
//     })
//     status: AttendanceStatus;

//     @ManyToOne(() => StaffEntity, (staff) => staff.attendances, { eager: true })
//     @JoinColumn({ name: 'staff_id' })
//     staff: StaffEntity;

//     @Column({ name: 'staff_id', type: 'varchar', length: 50, nullable: false })
//     staffId: string;

//     @Column({ name: 'staff_code', type: 'varchar', length: 50, nullable: false })
//     staffCode: string;

//     @Column({ name: 'staff_name', type: 'varchar', length: 100, nullable: false })
//     staffName: string;

//     @ManyToOne(() => BranchEntity, (branch) => branch.attendances, { eager: true })
//     @JoinColumn({ name: 'branch_id' })
//     branch: BranchEntity;

//     @Column({ name: 'branch_id', type: 'int', nullable: false })
//     branchId: number;

//     @Column({ name: 'company_code', type: 'varchar', length: 20, nullable: false })
//     companyCode: string;

//     @Column({ name: 'unit_code', type: 'varchar', length: 20, nullable: false })
//     unitCode: string;
// }
