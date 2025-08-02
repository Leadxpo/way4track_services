import { BranchEntity } from 'src/branch/entity/branch.entity';
import { DesignationEntity } from 'src/designation/entity/designation.entity';
import { NotificationEntity } from 'src/notifications/entity/notification.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { SubDelaerStaffEntity } from 'src/sub-dealer-staff/entity/sub-dealer-staff.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { WorkStatusEnum } from 'src/work-allocation/enum/work-status-enum';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';


@Entity('tickets')
export class TicketsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StaffEntity, (branchEntity) => branchEntity.tickets, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staff: StaffEntity;

    @ManyToOne(() => StaffEntity, (branchEntity) => branchEntity.tickets, { nullable: true })
    @JoinColumn({ name: 'reporting_staff_id' })
    reportingStaff: StaffEntity;

    @Column({ name: 'problem', type: 'text', nullable: true })
    problem: string;

    @Column({ name: 'remark', type: 'text', nullable: true })
    remark: string;

    @Column({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.tickets, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branch: BranchEntity;

    @Column({ name: 'ticket_number', type: 'varchar', length: 50, unique: true })
    ticketNumber: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: WorkStatusEnum, name: 'work_status', default: WorkStatusEnum.PENDING, nullable: true })
    workStatus: WorkStatusEnum;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => NotificationEntity, (NotificationEntity) => NotificationEntity.ticket)
    notifications: NotificationEntity[];


    @ManyToOne(() => SubDealerEntity, (requestRaiseEntity) => requestRaiseEntity.tickets, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealerId: SubDealerEntity;

    @ManyToOne(() => DesignationEntity, (designation) => designation.ticket, { nullable: true })
    @JoinColumn({ name: 'designation_id', referencedColumnName: 'id' }) // Use the primary key of DesignationEntity
    designationRelation: DesignationEntity;

    @ManyToOne(() => SubDelaerStaffEntity, (SubDelaerStaffEntity) => SubDelaerStaffEntity.subTickets, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_staff_id' })
    subDealerStaffId: SubDelaerStaffEntity;
}
