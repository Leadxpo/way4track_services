import { BranchEntity } from 'src/branch/entity/branch.entity';
import { DispatchEntity } from 'src/dispatch/entity/dispatch.entity';
import { LedgerEntity } from 'src/ledger/entity/ledger.entity';
import { NotificationEntity } from 'src/notifications/entity/notification.entity';
import { PermissionEntity } from 'src/permissions/entity/permissions.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { StaffStatus } from 'src/staff/enum/staff-status';
import { SubDelaerStaffEntity } from 'src/sub-dealer-staff/entity/sub-dealer-staff.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('sub_dealer')
export class SubDealerEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'sub_dealer_photo', type: 'text', nullable: true })
  subDealerPhoto: string;

  @Column({ name: 'sub_dealer_id', type: 'varchar', length: 100, unique: true })
  subDealerId: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  @Column({ name: 'sub_dealer_phone_number', type: 'varchar', length: 15 })
  subDealerPhoneNumber: string;

  @Column({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true })
  alternatePhoneNumber?: string;

  @Column({ name: 'gst_number', type: 'varchar', length: 100, unique: true, nullable: true })
  gstNumber: string;

  @Column({ name: 'starting_date', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startingDate: Date;

  @Column({ name: 'email', type: 'varchar', length: 150 })
  emailId: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 100, unique: true })
  aadharNumber: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @OneToMany(() => VoucherEntity, (product) => product.subDealer)
  voucherId: VoucherEntity[];

  @OneToMany(() => RequestRaiseEntity, (product) => product.subDealerId)
  request: RequestRaiseEntity[];

  @OneToMany(() => TicketsEntity, (product) => product.subDealerId)
  tickets: TicketsEntity[];

  @ManyToOne(() => BranchEntity, (BranchEntity) => BranchEntity.subDealer, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => PermissionEntity, (PermissionEntity) => PermissionEntity.subDealerId)
  permissions: PermissionEntity[];

  @OneToMany(() => LedgerEntity, (LedgerEntity) => LedgerEntity.subDealerId)
  ledger: LedgerEntity[];

  @OneToMany(() => DispatchEntity, (DispatchEntity) => DispatchEntity.subDealerId)
  dispatch: DispatchEntity[];

  @OneToMany(() => ProductAssignEntity, (ProductAssignEntity) => ProductAssignEntity.subDealerId)
  productAssign: ProductAssignEntity[];

  @OneToMany(() => TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.subDealerId)
  techWork: TechnicianWorksEntity[];

  @OneToMany(() => SubDelaerStaffEntity, (SubDelaerStaffEntity) => SubDelaerStaffEntity.subDealerId)
  subDealerStaff: SubDelaerStaffEntity[];

  @OneToMany(() => NotificationEntity, (NotificationEntity) => NotificationEntity.subDealerId)
  note: NotificationEntity[];

  @OneToMany(() => ProductEntity, (asserts) => asserts.subDealerId)
  product: ProductEntity[];

  @Column({
    type: 'enum',
    name: 'status',
    enum: StaffStatus,
    nullable: true,
    default: StaffStatus.ACTIVE
  })
  status: StaffStatus;
}
