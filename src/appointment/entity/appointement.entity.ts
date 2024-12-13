import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
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
    })
    appointmentType: AppointmentType;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'slot', type: 'timestamp' })
    slot: Date;

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

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.asserts)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;
}