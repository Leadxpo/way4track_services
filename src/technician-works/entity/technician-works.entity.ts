import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { PaymentStatus } from 'src/product/dto/payment-status.enum';
import { ProductEntity } from 'src/product/entity/product.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { WorkStatusEnum } from 'src/work-allocation/enum/work-status-enum';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('technician_works')
export class TechnicianWorksEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'service', type: 'varchar', length: 100, nullable: true })
    service: string;

    @Column({ type: 'enum', enum: WorkStatusEnum, name: 'work_status', default: WorkStatusEnum.PENDING, nullable: true })
    workStatus: WorkStatusEnum;

    @Column({ type: 'enum', enum: PaymentStatus, name: 'payment_status', default: PaymentStatus.SENT, nullable: true })
    paymentStatus: PaymentStatus;

    @Column({ name: 'imei_number', type: 'varchar', length: 20, nullable: true })
    imeiNumber: string;

    @Column({ name: 'vehicle_type', type: 'varchar', length: 20, nullable: true })
    vehicleType: string;

    @Column({ name: 'vehicle_number', type: 'varchar', length: 20, nullable: true })
    vehicleNumber: string;

    @Column({ name: 'chassis_number', type: 'varchar', length: 20, nullable: true })
    chassisNumber: string;

    @Column({ name: 'engine_number', type: 'varchar', length: 20, nullable: true })
    engineNumber: string;

    @Column({ name: 'vehicle_photo', type: 'varchar', length: 255, nullable: true })
    vehiclePhoto: string;

    @Column({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    date: Date;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.technician, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.technician, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @ManyToOne(() => ProductEntity, (productEntity) => productEntity.technician, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    productId: ProductEntity;

    @ManyToOne(() => VendorEntity, (vendorEntity) => vendorEntity.technician, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendorId: VendorEntity;

    @ManyToOne(() => ClientEntity, (clientEntity) => clientEntity.technician, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @ManyToOne(() => VoucherEntity, (voucherEntity) => voucherEntity.technician, { nullable: true })
    @JoinColumn({ name: 'voucher_id' })
    voucherId: VoucherEntity;

    @ManyToOne(() => WorkAllocationEntity, (workAllocationEntity) => workAllocationEntity.technician, { nullable: true })
    @JoinColumn({ name: 'work_id' })
    workId: WorkAllocationEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column('varchar', { name: 'product_name', nullable: true })
    productName: string

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 15, unique: true, nullable: true })
    phoneNumber: string;

    @Column({ name: 'sim_number', type: 'varchar', length: 15, unique: true, nullable: true })
    simNumber: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string;// Removed price field as per the previous request
}
