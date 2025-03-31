import { ClientEntity } from "src/client/entity/client.entity";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { ProductEntity } from "src/product/entity/product.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { WorkAllocationEntity } from "src/work-allocation/entity/work-allocation.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
export enum GSTORTDSEnum {
    GST = "GST",
    TDS = "TDS"
}
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

    @Column({ type: 'varchar', length: 255, name: 'building_address', nullable: true })
    buildingAddress: string;

    @Column({ name: 'estimate_date', type: 'timestamp', nullable: true })
    estimateDate: Date;

    @Column({ type: 'varchar', name: 'estimate_id', nullable: true })
    estimateId: string;

    @Column({ type: 'varchar', name: 'invoice_id', nullable: true })
    invoiceId: string;

    @Column({ type: 'date', name: 'expire_date', nullable: true })
    expireDate: string;

    @Column({ type: 'varchar', length: 100, name: 'product_or_service', nullable: true })
    productOrService: string;

    @Column({ type: 'varchar', length: 255, name: 'description', nullable: true })
    description: string;

    @Column({ type: 'float', name: 'amount', nullable: true })
    amount: number;

    @Column({ type: 'float', name: 'quantity', nullable: true })
    quantity: number;

    // @Column({ type: 'float', name: 'hsn_code', nullable: true })
    // hsnCode: string;

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
    }[];

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'gst/tds', type: 'enum', nullable: true, enum: GSTORTDSEnum })
    GSTORTDS: GSTORTDSEnum;

    @Column({ name: 'status', type: 'enum', nullable: true, enum: ClientStatusEnum })
    status: ClientStatusEnum;

    @Column({ name: 'scst', type: 'float', nullable: true })
    SCST: number;

    @Column({ name: 'cgst', type: 'float', nullable: true })
    CGST: number;

    @Column({ nullable: true })
    estimatePdfUrl: string;

    @Column({ nullable: true })
    invoicePdfUrl: string

    @Column({ nullable: true })
    receiptPdfUrl: string
}
