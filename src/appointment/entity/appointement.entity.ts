import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';


export enum AppointmentType {
    SERVICE = 'service',
    PRODUCT = 'product',
}

export enum AppointmentStatus {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    SENT = 'sent',
}

export enum TimePeriodEnum {
    AM = 'AM',
    PM = 'PM'
}
@Entity('appointments')
export class AppointmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'appointment_id',
        type: 'varchar',
        length: 50,
        unique: true,
    })
    appointmentId: string;

    @Column({
        name: 'appointment_type',
        type: 'enum',
        enum: AppointmentType,
        default: AppointmentType.PRODUCT
    })
    appointmentType: AppointmentType;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'date', type: 'date', nullable: true })
    date: string | null;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'time', type: 'time' })
    slot: string;

    @Column({ name: 'period', type: 'enum', enum: TimePeriodEnum,nullable:true })
    period: TimePeriodEnum;


    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.SENT,
    })
    status: AppointmentStatus;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.appointment)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.appiontment)
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @ManyToOne(() => VoucherEntity, (VoucherEntity) => VoucherEntity.appointments)
    @JoinColumn({ name: 'voucher_id' })
    voucherId: VoucherEntity;

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.appointment)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
