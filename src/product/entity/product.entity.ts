import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name', type: 'varchar', length: 100 })
  productName: string;

  @Column({ name: 'product_photo', type: 'text', nullable: true })
  productPhoto: string;

  @Column({ name: 'device_model', type: 'varchar', length: 50 })
  emiNumber: string;

  @Column({ name: 'emi_number', type: 'varchar', length: 50 })
  deviceModel: string;

  @Column({ name: 'date_of_purchase', type: 'date' })
  dateOfPurchase: Date;

  @Column({ name: 'imei_number', type: 'varchar', length: 20 })
  imeiNumber: string;

  @Column({ name: 'category_name', type: 'varchar', length: 50 })
  categoryName: string;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'product_description', type: 'text' })
  productDescription: string;

  @ManyToOne(() => VendorEntity, (vendorEntity) => vendorEntity.product)
  @JoinColumn({ name: 'vendor_id' })
  vendorId: VendorEntity;

  @Column({ name: 'vendor_phone_number', type: 'varchar', length: 15, nullable: true })
  vendorPhoneNumber: string;

  @Column({ name: 'vendor_name', type: 'varchar', length: 100, nullable: true })
  vendorName: string;

  @Column({ name: 'vendor_address', type: 'text', nullable: true })
  vendorAddress: string;

  @Column({ name: 'vendor_email_id', type: 'varchar', length: 150, nullable: true })
  vendorEmailId: string;

  @ManyToOne(() => VoucherEntity, (voucherEntity) => voucherEntity.product)
  @JoinColumn({ name: 'voucher_id' })
  voucherId: VoucherEntity;

  @OneToMany(() => ProductAssignEntity, (product) => product.productId)
  productAssign: ProductAssignEntity[];

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  // New columns
  @Column({ name: 'supplier_name', type: 'varchar', length: 100, nullable: true })
  supplierName: string;

  @Column({ name: 'serial_number', type: 'varchar', length: 50, nullable: true })
  serialNumber: string;

  @Column({ name: 'primary_no', type: 'varchar', length: 15, nullable: true })
  primaryNo: string;

  @Column({ name: 'secondary_no', type: 'varchar', length: 15, nullable: true })
  secondaryNo: string;

  @Column({ name: 'primary_network', type: 'varchar', length: 50, nullable: true })
  primaryNetwork: string;

  @Column({ name: 'secondary_network', type: 'varchar', length: 50, nullable: true })
  secondaryNetwork: string;

  @Column({ name: 'sim_status', type: 'varchar', length: 20, nullable: true })
  simStatus: string;

  @Column({ name: 'plan_name', type: 'varchar', length: 100, nullable: true })
  planName: string;

  @Column({ name: 'remarks_1', type: 'text', nullable: true })
  remarks1: string;

  @Column({ name: 'remarks_2', type: 'text', nullable: true })
  remarks2: string;
}
