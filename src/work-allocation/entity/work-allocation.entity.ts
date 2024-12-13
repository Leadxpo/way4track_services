import { ClientEntity } from 'src/client/entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('work_allocations')
export class WorkAllocationEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'work_allocation_number', type: 'varchar', unique: true })
    workAllocationNumber: string;

    @Column({ name: 'service_or_product', type: 'varchar', length: 100 })
    serviceOrProduct: string;

    @Column({ name: 'other_information', type: 'text' })
    otherInformation: string;

    @Column({ name: 'date', type: 'date' })
    date: Date;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.workAllocation)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.workAllocation)
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;
}
