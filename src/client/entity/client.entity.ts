import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client')
export class ClientEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 15, unique: true })
    phoneNumber: string;

    @Column({ name: 'client_id', type: 'varchar', length: 50, unique: true })
    clientId: string;

    @OneToMany(() => RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.staffId)
    request: RequestRaiseEntity[];

    @Column({ name: 'dob', type: 'date' })
    dob: string;

    @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ name: 'address', type: 'text' })
    address: string;

    @Column({ name: 'joining_date', type: 'date' })
    joiningDate: string;


    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.client)
    @JoinColumn({ name: 'branch_id' })
    branch: BranchEntity;

    @OneToMany(() => VoucherEntity, (voucher) => voucher.clientId)
    voucherId: VoucherEntity[];

    @OneToMany(() => AppointmentEntity, (asserts) => asserts.clientId)
    appiontment: AppointmentEntity[];

    @OneToMany(() => EstimateEntity, (asserts) => asserts.clientId)
    estimate: EstimateEntity[];

    @OneToMany(() => WorkAllocationEntity, (asserts) => asserts.clientId)
    workAllocation: WorkAllocationEntity[];

    @Column({ name: 'client_photo', type: 'text', nullable: true })
    clientPhoto: string;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
