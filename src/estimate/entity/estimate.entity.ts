import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { ProductEntity } from "src/product/entity/product.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { WorkAllocationEntity } from "src/work-allocation/entity/work-allocation.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('estimates')
export class EstimateEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.workAllocation, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @ManyToOne(() => VendorEntity, (VendorEntity) => VendorEntity.estimate, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendorId: VendorEntity;

    @ManyToOne(() => BranchEntity, (BranchEntity) => BranchEntity.estimate, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column({ type: 'varchar', length: 255, name: 'building_address', nullable: true })
    buildingAddress: string;
    
    @Column({ type: 'varchar', length: 255, name: 'shipping_address', nullable: true })
    shippingAddress: string;

    @Column({ name: 'estimate_date', type: 'timestamp', nullable: true })
    estimateDate: Date;

    @Column({ type: 'varchar', name: 'estimate_id', nullable: true })
    estimateId: string;

    @Column({ type: 'varchar', name: 'account_id', nullable: true })
    accountId: string;

    @Column({ type: 'varchar', name: 'invoice_id', nullable: true })
    invoiceId: string;

    @Column({ type: 'date', name: 'expire_date', nullable: true })
    expireDate: string;

    @Column({ type: 'varchar', length: 100, name: 'product_or_service', nullable: true })
    productOrService: string;

    @Column({ type: 'varchar', length: 200, name: 'taxable_state', nullable: true })
    taxableState: string;

    @Column({ type: 'varchar', length: 200, name: 'supply_state', nullable: true })
    supplyState: string;

    @Column({ type: 'text',  name: 'description', nullable: true })
    description: string;

    @Column({ type: 'float', name: 'amount', nullable: true })
    amount: number;

    @Column({ type: 'float', name: 'quantity', nullable: true })
    quantity: number;

    @OneToMany(() => ProductEntity, (product) => product.estimate)
    products: ProductEntity[];

    @OneToMany(() => VoucherEntity, (product) => product.estimate)
    invoice: VoucherEntity[];

    @OneToMany(() => WorkAllocationEntity, (product) => product.estimateId)
    work: WorkAllocationEntity[];

    @OneToMany(() => WorkAllocationEntity, (product) => product.invoiceId)
    workId: WorkAllocationEntity[];

    @Column({ type: 'json', name: 'product_details', nullable: true })
    productDetails: {
        type?: string
        productId?: number;
        productName: string;
        quantity: number;
        costPerUnit: number;
        totalCost: number;
        hsnCode: string;
        description:string;
    }[];

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column('varchar', { name: 'prefix', length: 100, nullable: true })
    prefix: string;

    @Column('varchar', { name: 'invoice_prefix', length: 100, nullable: true })
    invoicePrefix: string;

    @Column({ name: 'isGST', type: 'boolean', nullable: true })
    isGST: boolean;

    @Column({ name: 'isTDS', type: 'boolean', nullable: true })
    isTDS: boolean;

    @Column({ name: 'status', type: 'enum', nullable: true, enum: ClientStatusEnum })
    status: ClientStatusEnum;
    
    @Column({ name: 'scst', type: 'float', nullable: true })
    SCST: number;

    @Column({ name: 'cgst', type: 'float', nullable: true })
    CGST: number;

    @Column({ name: 'tds', type: 'float', nullable: true })
    TDS: number;

    @Column({ nullable: true })
    estimatePdfUrl: string;

    @Column({ nullable: true })
    invoicePdfUrl: string

    @Column({ nullable: true })
    receiptPdfUrl: string

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
}
