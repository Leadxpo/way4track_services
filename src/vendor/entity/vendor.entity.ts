import { BranchEntity } from 'src/branch/entity/branch.entity';
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vendor')
export class VendorEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'vendor_id', type: 'varchar', length: 20, unique: true, nullable: true })
  vendorId: string;

  @Column({ name: 'vendor_phone_number', type: 'varchar', length: 15, default: '', nullable: true })
  vendorPhoneNumber: string;

  @Column({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true })
  alternatePhoneNumber?: string;

  @Column({ name: 'product_type', type: 'varchar', length: 50, nullable: true })
  productType: string;

  @Column({ name: 'vendor_photo', type: 'text', nullable: true })
  vendorPhoto: string;

  @Column({ name: 'starting_date', type: 'date', nullable: true })
  startingDate: Date;

  @Column({ name: 'email', type: 'varchar', length: 150, nullable: true, unique: true })
  emailId: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 20, unique: true, nullable: true })
  aadharNumber: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @OneToMany(() => ProductEntity, (product) => product.vendorId, { nullable: true })
  product: ProductEntity[];

  @OneToMany(() => WorkAllocationEntity, (product) => product.vendorId, { nullable: true })
  workAllocation: WorkAllocationEntity[];

  @OneToMany(() => VoucherEntity, (product) => product.vendorId, { nullable: true })
  voucherId: VoucherEntity[];

  @OneToMany(() => EstimateEntity, (product) => product.vendorId, { nullable: true })
  estimate: EstimateEntity[];

  @ManyToOne(() => BranchEntity, (BranchEntity) => BranchEntity.vendor, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: true, default: 'WAY4TRACK' })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: true, default: 'WAY4' })
  unitCode: string;

  @Column({ name: 'GST_number', type: 'varchar', length: 150, nullable: true })
  GSTNumber: string;
}
