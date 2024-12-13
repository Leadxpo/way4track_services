import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { RoleEnum } from '../enum/role-enum';
import { VoucherTypeEnum } from '../enum/voucher-type-enum';
import { PaymentType } from 'src/asserts/enum/payment-type.enum';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { PaymentStatus } from 'src/product/dto/payment-status.enum';
import { ProductType } from 'src/product/dto/product-type.enum';
import { ClientEntity } from 'src/client/entity/client.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { AssertsEntity } from 'src/asserts/entity/asserts-entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';

@Entity('vouchers')
export class VoucherEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'quantity', type: 'int' })
    quantity: number;

    @Column({ name: 'voucher_id', type: 'varchar' })
    voucherId: string;

    @ManyToOne(() => BranchEntity, (BranchEntity) => BranchEntity.voucher)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column({ type: 'enum', enum: RoleEnum, name: 'role' })
    role: RoleEnum;

    @Column({ name: 'purpose', type: 'varchar', length: 255 })
    purpose: string;

    @Column({ name: 'credit_amount', type: 'float' })
    creditAmount: number;

    @Column({
        type: 'enum',
        name: 'payment_type',
        enum: PaymentType,
        default: PaymentType.CASH,
    })
    paymentType: PaymentType;

    @Column({ name: 'payment_to', type: 'varchar', length: 100 })
    paymentTo: string;

    @Column({ name: 'debit_amount', type: 'float' })
    debitAmount: number;

    @Column({ name: 'transferred_by', type: 'varchar', length: 100 })
    transferredBy: string;

    @Column({ name: 'bank_from', type: 'varchar', length: 100 })
    bankFrom: string;

    @Column({ name: 'bank_to', type: 'varchar', length: 100 })
    bankTo: string;

    @Column({ name: 'voucher_type', type: 'enum', enum: VoucherTypeEnum })
    voucherType: VoucherTypeEnum;

    @Column({ name: 'generation_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    generationDate: Date;

    @Column({ name: 'expire_date', type: 'timestamp' })
    expireDate: Date;

    @Column({ name: 'shipping_address', type: 'varchar', length: 255 })
    shippingAddress: string;

    @Column({ name: 'building_address', type: 'varchar', length: 255 })
    buildingAddress: string;

    @Column({ name: 'balance_amount', type: 'float' })
    balanceAmount: number;

    @Column({ name: 'total', type: 'float' })
    total: number;

    @Column({ name: 'hsn_code', type: 'varchar', length: 20 })
    hsnCode: string;

    @Column({ name: 'gst', type: 'float' })
    GST: number;

    @Column({ name: 'scst', type: 'float' })
    SCST: number;

    @Column({ name: 'cgst', type: 'float' })
    CGST: number;

    @Column({ name: 'amount', type: 'float' })
    amount: number;

    @OneToMany(() => ProductEntity, product => product.voucherId)
    product: ProductEntity[];

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        name: 'payment_status',
        default: PaymentStatus.ACCEPTED,
    })
    paymentStatus: PaymentStatus;

    @Column({
        type: 'enum',
        enum: ProductType,
        name: 'product_type',
        default: ProductType.product,
    })
    productType: ProductType;

    @OneToMany(() => ClientEntity, (voucher) => voucher.voucherId)
    client: ClientEntity[];

    @OneToMany(() => VendorEntity, (voucher) => voucher.voucherId)
    vendor: VendorEntity[]; AssertsEntity

    @Column('decimal', { name: 'initial_payment', precision: 10, scale: 2 })
    initialPayment: number;

    @Column('int', { name: 'emi_count' })
    numberOfEmi: number;

    @Column('int', { name: 'emi_number' })
    emiNumber: number;

    @Column('decimal', { name: 'emi_amount', precision: 10, scale: 2 })
    emiAmount: number;

    @Column('varchar', { name: 'ifsc_code', length: 20 })
    ifscCode: string;

    @Column('varchar', { name: 'bank_account_number', length: 20 })
    bankAccountNumber: string;

    @OneToMany(() => AssertsEntity, (voucher) => voucher.voucherId)
    assert: AssertsEntity[];

    @OneToMany(() => SubDealerEntity, (voucher) => voucher.voucherId)
    subDealer: SubDealerEntity[];
}
