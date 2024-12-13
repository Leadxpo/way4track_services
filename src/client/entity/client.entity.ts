import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ClientStatusEnum } from '../enum/client-status.enum';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';

@Entity('client')
export class ClientEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 15 })
    phoneNumber: string;

    @Column({ name: 'client_id', type: 'varchar', length: 50, unique: true })
    clientId: string;

    @Column({ name: 'dob', type: 'date' })
    dob: Date;

    @Column({ name: 'email', type: 'varchar', length: 150 })
    email: string;

    @Column({ name: 'address', type: 'text' })
    address: string;

    @Column({ name: 'joining_date', type: 'date' })
    joiningDate: Date;


    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.client)
    @JoinColumn({ name: 'branch_id' })
    branch: BranchEntity;

    @ManyToOne(() => VoucherEntity, (VoucherEntity) => VoucherEntity.client)
    @JoinColumn({ name: 'voucher_id' })
    voucherId: VoucherEntity;

    @OneToMany(() => AppointmentEntity, (asserts) => asserts.clientId)
    appiontment: AppointmentEntity[];

    @OneToMany(() => EstimateEntity, (asserts) => asserts.clientId)
    estimate: EstimateEntity[];

    @OneToMany(() => WorkAllocationEntity, (asserts) => asserts.clientId)
    workAllocation: WorkAllocationEntity[];

    @Column({ name: 'client_photo', type: 'text', nullable: true })
    clientPhoto: string;
}
