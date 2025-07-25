import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkStatusEnum } from '../enum/work-status-enum';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { SalesWorksEntity } from 'src/sales-man/entity/sales-man.entity';
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';

@Entity('work_allocations')
export class WorkAllocationEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'work_allocation_number', type: 'varchar', unique: true })
    workAllocationNumber: string;

    @Column({ name: 'service_or_product', type: 'varchar', length: 100, nullable: true })
    serviceOrProduct: string;

    @Column({ name: 'other_information', type: 'text', nullable: true })
    otherInformation: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'service', type: 'text', nullable: true })
    service: string;

    @Column({ type: 'enum', enum: WorkStatusEnum, name: 'work_status', default: WorkStatusEnum.PENDING, nullable: true })
    workStatus: WorkStatusEnum;

    @Column({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    date: Date;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.workAllocation, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => BranchEntity, (BranchEntity) => BranchEntity.workAllocation, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @ManyToOne(() => ProductEntity, (ProductEntity) => ProductEntity.workAllocation, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    productId: ProductEntity;

    @ManyToOne(() => VendorEntity, (VendorEntity) => VendorEntity.workAllocation, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendorId: VendorEntity;

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.workAllocation, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @ManyToOne(() => VoucherEntity, (VoucherEntity) => VoucherEntity.workAllocation, { nullable: true })
    @JoinColumn({ name: 'voucher_id' })
    voucherId: VoucherEntity;

    @OneToMany(() => TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.workId)
    technician: TechnicianWorksEntity[];

    @Column('varchar', { name: 'company_code', length: 200, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 200, nullable: false })
    unitCode: string;

    // @Column({ name: 'imei_number', type: 'varchar', length: 200 })
    // imeiNumber: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column('varchar', { name: 'product_name', nullable: true })
    productName: string

    @Column({ name: 'amount', type: 'float', nullable: true })
    amount: number;

    @Column('varchar', { name: 'visitingNumber', length: 200, nullable: true })
    visitingNumber: string;

    @ManyToOne(() => StaffEntity, (designation) => designation.sales, { nullable: true })
    @JoinColumn({ name: 'sales_id', referencedColumnName: 'id' }) // Use the primary key of StaffEntity
    salesStaffRelation: StaffEntity;

    @ManyToOne(() => EstimateEntity, (Estimate) => Estimate.work, { nullable: true })
    @JoinColumn({ name: 'estimate_id', referencedColumnName: 'id' })
    estimateId: EstimateEntity;

    @ManyToOne(() => EstimateEntity, (Estimate) => Estimate.workId, { nullable: true })
    @JoinColumn({ name: 'invoice_id', referencedColumnName: 'id' })
    invoiceId: EstimateEntity;
}
