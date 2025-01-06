import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('vendor')
export class VendorEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'vendor_id', type: 'varchar', length: 20, unique: true })
  vendorId: string;

  @Column({ name: 'vendor_phone_number', type: 'varchar', length: 15 })
  vendorPhoneNumber: string;

  @Column({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true })
  alternatePhoneNumber?: string;

  @Column({ name: 'product_type', type: 'varchar', length: 50 })
  productType: string;

  @Column({ name: 'vendor_photo', type: 'text', nullable: true })
  vendorPhoto: string;

  @Column({ name: 'starting_date', type: 'date' })
  startingDate: Date;

  @Column({ name: 'email', type: 'varchar', length: 150 })
  emailId: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 20 })
  aadharNumber: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @OneToMany(() => ProductEntity, (product) => product.vendorId)
  product: ProductEntity[];

  @OneToMany(() => WorkAllocationEntity, (product) => product.vendorId)
  workAllocation: WorkAllocationEntity[];

  @ManyToOne(() => VoucherEntity, (VoucherEntity) => VoucherEntity.vendor, { nullable: true })
  @JoinColumn({ name: 'voucher_id' })
  voucherId: VoucherEntity;

  @ManyToOne(() => BranchEntity, (BranchEntity) => BranchEntity.vendor, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;
}
