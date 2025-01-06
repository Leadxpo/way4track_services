import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('work_allocations')
export class WorkAllocationEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'work_allocation_number', type: 'varchar', unique: true })
    workAllocationNumber: string;

    @Column({ name: 'service_or_product', type: 'varchar', length: 100 })
    serviceOrProduct: string;

    @Column({ name: 'other_information', type: 'text' })
    otherInformation: string;

    @Column({ name: 'date', type: 'date' })
    date: Date;

    @Column({ name: 'install', type: 'boolean', default: false })
    install: boolean

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.workAllocation)
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

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.workAllocation)
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
