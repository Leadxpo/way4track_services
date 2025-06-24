import { BranchEntity } from 'src/branch/entity/branch.entity';
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';
import { LedgerEntity } from 'src/ledger/entity/ledger.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
// import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vendor')
export class VendorEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'vendor_id', type: 'varchar', length: 200, unique: true, nullable: true })
  vendorId: string;

  @Column({ name: 'vendor_phone_number', type: 'varchar', length: 15, default: '', nullable: true })
  vendorPhoneNumber: string;

  @Column({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true })
  alternatePhoneNumber?: string;

  // @Column({ name: 'product_type', type: 'varchar', length: 50, nullable: true })
  // productType: string;

  @Column({ name: 'vendor_photo', type: 'text', nullable: true })
  vendorPhoto: string;

  // @Column({ name: 'starting_date', type: 'date', nullable: true })
  // startingDate: Date;

  @Column({ name: 'email', type: 'varchar', length: 150, nullable: true})
  emailId: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @Column({ name: 'state', type: 'varchar', length: 150, nullable: true })
  state: string;

  @OneToMany(() => ProductEntity, (product) => product.vendorId, { nullable: true })
  product: ProductEntity[];

  @OneToMany(() => TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.vendorId)
  technician: TechnicianWorksEntity[];

  @OneToMany(() => WorkAllocationEntity, (product) => product.vendorId, { nullable: true })
  workAllocation: WorkAllocationEntity[];

  // @OneToMany(() => VoucherEntity, (product) => product.vendorId, { nullable: true })
  // voucherId: VoucherEntity[];

  @OneToMany(() => LedgerEntity, (product) => product.vendorId, { nullable: true })
  ledger: LedgerEntity[];

  @OneToMany(() => EstimateEntity, (product) => product.vendorId, { nullable: true })
  estimate: EstimateEntity[];

  @ManyToOne(() => BranchEntity, (BranchEntity) => BranchEntity.vendor, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @Column('varchar', { name: 'company_code', length: 200, nullable: true, default: 'WAY4TRACK' })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 200, nullable: true, default: 'WAY4' })
  unitCode: string;

  @Column({ name: 'bank_details', type: 'text',  nullable: true })
  bankDetails: string;

  @Column({ name: 'GST_number', type: 'varchar', length: 150, nullable: true })
  GSTNumber: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
