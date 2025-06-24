import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';
import { ClientStatus, ClientStatusEnum } from '../enum/client-status.enum';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { DispatchEntity } from 'src/dispatch/entity/dispatch.entity';
import { LedgerEntity } from 'src/ledger/entity/ledger.entity';
import { CartEntity } from 'src/cart/entity/cart.entity';
import { AddressEntity } from 'src/address/entity/address.entity';
import { OrderEntity } from 'src/orders/entity/orders.entity';
import { TransactionEntity } from 'src/transactions/entity/transactions.entity';
import { RefundEntity } from 'src/refund/entity/refund.entity';
import { ReviewEntity } from 'src/reviews/entity/reviews-entity';

@Entity('client')
export class ClientEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 15, unique: true ,nullable: true})
    phoneNumber: string;

    @Column({ name: 'client_id', type: 'varchar', length: 50, unique: true })
    clientId: string;

    @OneToMany(() => RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.staffId)
    request: RequestRaiseEntity[];

    @OneToMany(() => RefundEntity, (requestRaiseEntity) => requestRaiseEntity.clientId)
    refund: RefundEntity[];

    @OneToMany(() => ReviewEntity, (requestRaiseEntity) => requestRaiseEntity.clientId)
    review: ReviewEntity[];

    @Column({ name: 'user_name', type: 'varchar', length: 100, nullable: true })
    userName: string;

    @Column({ name: 'tds', type: 'boolean', default: false, nullable: true })
    tds: boolean;

    @Column({ name: 'tcs', type: 'boolean', default: false, nullable: true })
    tcs: boolean;

    @Column({ name: 'email', type: 'varchar', length: 150, unique: true, nullable: true })
    email: string;

    @Column({ name: 'GST_number', type: 'varchar', length: 150, nullable: true })
    GSTNumber: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string;

    // @Column({ name: 'joining_date', type: 'date', nullable: true })
    // joiningDate: Date;

    @OneToMany(() => TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.clientId)
    technician: TechnicianWorksEntity[];

    @OneToMany(() => DispatchEntity, (DispatchEntity) => DispatchEntity.staffId)
    dispatch: DispatchEntity[];

    @OneToMany(() => TransactionEntity, (TransactionEntity) => TransactionEntity.client)
    transactions: TransactionEntity[];

    @OneToMany(() => AddressEntity, (AddressEntity) => AddressEntity.client)
    customerAddress: AddressEntity[];

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.client, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branch: BranchEntity;

    @OneToMany(() => VoucherEntity, (voucher) => voucher.clientId)
    voucherId: VoucherEntity[];

    @OneToMany(() => CartEntity, (voucher) => voucher.client)
    cart: CartEntity[];

    @OneToMany(() => OrderEntity, (voucher) => voucher.client)
    order: OrderEntity[];

    @OneToMany(() => AppointmentEntity, (asserts) => asserts.clientId)
    appiontment: AppointmentEntity[];

    @OneToMany(() => EstimateEntity, (asserts) => asserts.clientId)
    estimate: EstimateEntity[];

    @OneToMany(() => WorkAllocationEntity, (asserts) => asserts.clientId)
    workAllocation: WorkAllocationEntity[];

    @OneToMany(() => LedgerEntity, (asserts) => asserts.clientId)
    ledger: LedgerEntity[];

    @Column({ name: 'client_photo', type: 'text', nullable: true })
    clientPhoto: string;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'state', type: 'varchar', length: 200, nullable: true })
    state: string;

    @Column({ name: 'hsn_code', type: 'varchar', length: 100, nullable: true })
    hsnCode: string;

    @Column({ name: 'sac_code', type: 'varchar', length: 100, nullable: true })
    SACCode: string;

    @Column({ name: 'status', type: 'enum', enum: ClientStatus, default: ClientStatus.Active, nullable: true })
    status: ClientStatus
}
