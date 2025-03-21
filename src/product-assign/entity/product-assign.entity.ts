import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { ProductStatusEnum } from 'src/product/enum/product-status.enum';
import { DispatchEntity } from 'src/dispatch/entity/dispatch.entity';
import { ProductTypeEntity } from 'src/product-type/entity/product-type.entity';

@Entity('product_assignments')
export class ProductAssignEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.productAssign, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staffId: StaffEntity;

  @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.productAssign, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branchId: BranchEntity;

  @OneToMany(() => DispatchEntity, (DispatchEntity) => DispatchEntity.staffId, { nullable: true })
  dispatch: DispatchEntity[];

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.productAssign, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  productId: ProductEntity;

  @Column({ name: 'imei_number_from', type: 'varchar', length: 20 })
  imeiNumberFrom: string;

  @Column({ name: 'imei_number_to', type: 'varchar', length: 20 })
  imeiNumberTo: string;

  @Column({ name: 'number_of_products', type: 'int' })
  numberOfProducts: number;

  @ManyToOne(() => RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.productAssign, { nullable: true })
  @JoinColumn({ name: 'request_id' })
  requestId: RequestRaiseEntity;

  @Column({ name: 'product_assign_photo', type: 'text', nullable: true })
  productAssignPhoto: string;

  @Column({ name: 'branch_person', type: 'varchar', length: 20 })
  branchOrPerson: string;

  // @Column({ name: 'assigned_qty', type: 'int', nullable: true, default: null })
  // assignedQty: number;

  @Column({ name: 'is_assign', type: 'varchar', default: false })
  isAssign: string;

  @Column({ name: 'assign_time', type: 'timestamp', nullable: true })
  assignTime: Date;

  @Column({ name: 'assign_to', type: 'varchar', length: 50, nullable: true })
  assignTo: string;

  @ManyToOne(() => ProductTypeEntity, (ProductTypeEntity) => ProductTypeEntity.productAssign)
  @JoinColumn({ name: 'product_type_id' })
  productTypeId: ProductTypeEntity;

  @Column({ name: 'in_hands', type: 'varchar', default: false })
  inHands: string;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column({ name: 'status', type: 'enum', enum: ProductStatusEnum, default: ProductStatusEnum.available })
  status: ProductStatusEnum

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
