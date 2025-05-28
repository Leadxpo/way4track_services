import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { PaymentStatus } from 'src/product/dto/payment-status.enum';
import { ProductEntity } from 'src/product/entity/product.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


export enum LeadStatusEnum {
    PENDING = 'pending',
    ALLOCATED = 'allocated',
    INCOMPLETE = 'incomplete',
    PAYMENT_PENDING = "paymentPending",
    PARTIALLY_PAID = "partiallyPaid",
    COMPLETED = 'completed',
}

@Entity('sales')
export class SalesWorksEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'visiting_card', type: 'varchar', length: 255, nullable: true })
    visitingCard: string;

    @Column({ name: 'client_photo', type: 'varchar', length: 255, nullable: true })
    clientPhoto: string;

    @Column({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    date: Date;

    @Column({ name: 'estimate_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    estimateDate: Date;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.salesWork, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;
    
    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.salesWork, { nullable: true })
    @JoinColumn({ name: 'allocate_staff_id' })
    allocateStaffId: StaffEntity;
    
    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 30, nullable: true })
    phoneNumber: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string;

    @Column({ type: 'json', name: 'requirement_details', nullable: true })
    requirementDetails: {
        productName: string;
        quantity: number;
    }[];

    @Column({ type: 'json', name: 'service', nullable: true })
    service: {
        services: string;
        description: string;
    }[];

    @Column({ name: 'visiting_number', type: 'varchar', unique: true })
    visitingNumber: string;

    @Column({ type: 'enum', enum: LeadStatusEnum, name: 'lead_status', default: LeadStatusEnum.PENDING, nullable: true })
    leadStatus: LeadStatusEnum;

}
