import { EstimateEntity } from 'src/estimate/entity/estimate.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { ProductTypeEntity } from 'src/product-type/entity/product-type.entity';
// import { SalesWorksEntity } from 'src/sales-man/entity/sales-man.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { ProductStatusEnum } from '../enum/product-status.enum';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name', type: 'varchar', length: 100, nullable: true })
  productName: string;

  @Column({ name: 'product_photo', type: 'text', nullable: true })
  productPhoto: string;

  @Column({ name: 'device_model', type: 'varchar', length: 50, nullable: true })
  deviceModel: string;

  @Column({ name: 'in_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  inDate: Date;

  @Column({ name: 'imei_number', type: 'varchar', length: 20, nullable: true })
  imeiNumber: string;

  @Column({ name: 'category_name', type: 'varchar', length: 50, nullable: true })
  categoryName: string;

  @Column({ name: 'cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ name: 'quantity', type: 'int', nullable: true })
  quantity: number;

  @Column({ name: 'sno', type: 'int', nullable: true })
  SNO: number;

  @Column({ name: 'product_description', type: 'text', nullable: true })
  productDescription: string;

  @ManyToOne(() => VendorEntity, (vendorEntity) => vendorEntity.product, { nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendorId: VendorEntity;

  @ManyToOne(() => ProductTypeEntity, (ProductTypeEntity) => ProductTypeEntity.productType, { nullable: true })
  @JoinColumn({ name: 'product_type_id' })
  productTypeId: ProductTypeEntity;

  @Column({ name: 'product_type', type: 'varchar', length: 100, nullable: true })
  productType: string;

  @Column({ name: 'vendor_phone_number', type: 'varchar', length: 15, nullable: true })
  vendorPhoneNumber: string;

  @Column({ name: 'vendor_name', type: 'varchar', length: 100, nullable: true })
  vendorName: string;

  @Column({ name: 'vendor_address', type: 'text', nullable: true })
  vendorAddress: string;

  @Column({ name: 'vendor_email_id', type: 'varchar', length: 150, nullable: true })
  vendorEmailId: string;

  @OneToMany(() => VoucherEntity, (product) => product.product)
  voucherId: VoucherEntity[];

  // @OneToMany(() => SalesWorksEntity, (product) => product.productId)
  // sales: SalesWorksEntity[];

  @OneToMany(() => ProductAssignEntity, (product) => product.productId)
  productAssign: ProductAssignEntity[];

  @OneToMany(() => WorkAllocationEntity, (product) => product.productId)
  workAllocation: WorkAllocationEntity[];

  @Column('varchar', { name: 'company_code', length: 20, nullable: true, default: 'WAY4TRACK' })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: true, default: 'WAY4' })
  unitCode: string;

  // New columns
  @Column({ name: 'supplier_name', type: 'varchar', length: 100, nullable: true })
  supplierName: string;

  @Column({ name: 'ICCID_No', type: 'varchar', length: 100, nullable: true })
  ICCIDNo: string;

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

  @Column({ name: 'sim_status', type: 'varchar', length: 100, nullable: true })
  simStatus: string;

  @Column({ name: 'plan_name', type: 'varchar', length: 100, nullable: true })
  planName: string;

  @Column({ name: 'remarks_1', type: 'text', nullable: true })
  remarks1: string;

  @Column({ name: 'remarks_2', type: 'text', nullable: true })
  remarks2: string;

  @Column({ name: 'remarks_3', type: 'text', nullable: true })
  remarks3: string;

  @ManyToOne(() => EstimateEntity, (estimate) => estimate.products, { nullable: true })
  estimate: EstimateEntity;

  @Column({ type: 'float', name: 'hsn_code', nullable: true })
  hsnCode: string;

  @Column({ name: 'location', type: 'varchar', length: 50, default: 'warehouse' }) // Default to warehouse
  location: string;

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'not_assigned' }) // Default to not_assigned
  status: string;

  @Column({ name: 'mobile_number', type: 'varchar', length: 50, nullable: true })
  mobileNumber: string;

  @Column({ name: 'sim_no', type: 'varchar', length: 50, nullable: true })
  simNumber: string;

  @Column({ name: 'sim_imsi', type: 'varchar', length: 50, nullable: true })
  simImsi: string;

  @Column({ name: 'basket_name', type: 'varchar', length: 50, nullable: true })
  basketName: string;

  @OneToMany(() => TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.productId)
  technician: TechnicianWorksEntity[];

  @Column({ name: 'product_status', type: 'enum', enum: ProductStatusEnum, default: ProductStatusEnum.available })
  productStatus: ProductStatusEnum

  @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.product, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branchId: BranchEntity;

  @ManyToOne(() => SubDealerEntity, (sub) => sub.product, { nullable: true })
  @JoinColumn({ name: 'sub_dealer_id' })
  subDealerId: SubDealerEntity;

  @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.product, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staffId: StaffEntity;

  @Column({ name: 'assign_time', type: 'timestamp', nullable: true, })
  assignTime: Date;

}
