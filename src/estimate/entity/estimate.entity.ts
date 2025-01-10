import { ClientEntity } from "src/client/entity/client.entity";
import { ProductEntity } from "src/product/entity/product.entity";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductDetailDto } from "../dto/estimate.dto";
export enum GSTORTDSEnum {
    GST = "GST",
    TDS = "TDS"
}
@Entity('estimates')
export class EstimateEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.workAllocation)
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @Column({ type: 'varchar', length: 255, name: 'building_address' })
    buildingAddress: string;

    @Column({ type: 'date', name: 'estimate_date' })
    estimateDate: string;

    @Column({ type: 'varchar', name: 'estimate_id' })
    estimateId: string;

    @Column({ type: 'varchar', name: 'invoice_id', nullable: true })
    invoiceId: string;

    @Column({ type: 'date', name: 'expire_date' })
    expireDate: string;

    @Column({ type: 'varchar', length: 100, name: 'product_or_service' })
    productOrService: string;

    @Column({ type: 'varchar', length: 255, name: 'description' })
    description: string;

    @Column({ type: 'float', name: 'amount' })
    amount: number;

    @Column({ type: 'float', name: 'quantity' })
    quantity: number;

    @Column({ type: 'float', name: 'hsn_code' })
    hsnCode: string;

    @OneToMany(() => ProductEntity, (product) => product.estimate, { eager: true })
    products: ProductEntity[];

    @Column({ type: 'json', name: 'product_details', nullable: true })
    productDetails: {
        productId: number;
        productName: string;
        quantity: number;
        costPerUnit: number;
        totalCost: number;
    }[];

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'gst/tds', type: 'enum', nullable: true, enum: GSTORTDSEnum })
    GSTORTDS: GSTORTDSEnum;

    @Column({ name: 'scst', type: 'float', nullable: true })
    SCST: number;

    @Column({ name: 'cgst', type: 'float', nullable: true })
    CGST: number;
}
