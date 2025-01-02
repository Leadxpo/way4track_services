import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
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
import { AccountEntity } from 'src/account/entity/account.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';

export enum GSTORTDSEnum {
    GST = "GST",
    TDS = "TDS"
}
@Entity('voucher')
export class VoucherEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'quantity', type: 'int', nullable: true })
    quantity: number;

    @Column({ name: 'upi_id', type: 'varchar', length: 50, nullable: true })
    upiId: string;

    @Column({ name: 'check_number', type: 'varchar', length: 50, nullable: true })
    checkNumber: string;

    @Column({ name: 'card_number', type: 'varchar', length: 50, nullable: true })
    cardNumber: string;

    @ManyToOne(() => AccountEntity, (account) => account.vouchersFrom, { nullable: true })
    @JoinColumn({ name: 'from_account_id' })
    fromAccount: AccountEntity;

    @ManyToOne(() => AccountEntity, (account) => account.vouchersTo, { nullable: true })
    @JoinColumn({ name: 'to_account_id' })
    toAccount: AccountEntity;

    @Column({ name: 'voucher_id', type: 'varchar', length: 50, unique: true })
    voucherId: string;

    @ManyToOne(() => BranchEntity, (branch) => branch.voucher, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column({ type: 'enum', enum: RoleEnum, name: 'role', default: RoleEnum.CLIENT })
    role: RoleEnum;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'purpose', type: 'varchar', length: 255 })
    purpose: string;

    @Column({
        type: 'enum',
        name: 'payment_type',
        enum: PaymentType,
        default: PaymentType.CASH,
    })
    paymentType: PaymentType;

    @Column({ name: 'voucher_type', type: 'enum', enum: VoucherTypeEnum, default: VoucherTypeEnum.INVOICE })
    voucherType: VoucherTypeEnum;

    @Column({ name: 'generation_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    generationDate: Date;

    @Column({ name: 'expire_date', type: 'timestamp', nullable: true })
    expireDate: Date;

    @Column({ name: 'shipping_address', type: 'varchar', length: 255, nullable: true, default: null })
    shippingAddress: string;

    @Column({ name: 'building_address', type: 'varchar', length: 255, nullable: true, default: null })
    buildingAddress: string;

    @Column({ name: 'hsn_code', type: 'varchar', length: 20, nullable: true })
    hsnCode: string;

    @Column({ name: 'gst/tds', type: 'enum', nullable: true, enum: GSTORTDSEnum })
    GSTORTDS: GSTORTDSEnum;

    @Column({ name: 'scst', type: 'float', nullable: true })
    SCST: number;

    @Column({ name: 'cgst', type: 'float', nullable: true })
    CGST: number;

    @Column({ name: 'amount', type: 'float' })
    amount: number;

    @Column({ name: 'credit_amount', type: 'float' })
    creditAmount: number;

    @Column({ name: 'remining_amount', type: 'float' })
    remainingAmount: number;

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

    @OneToMany(() => VendorEntity, (voucher) => voucher.voucherId)
    vendor: VendorEntity[];


    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.voucherId, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @ManyToOne(() => StaffEntity, (StaffEntity) => StaffEntity.voucherId, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @Column('decimal', { name: 'initial_payment', precision: 10, scale: 2, nullable: true })
    initialPayment: number;

    @Column('int', { name: 'emi_count', nullable: true })
    numberOfEmi: number;

    @Column('int', { name: 'emi_number', nullable: true })
    emiNumber: number;

    @Column('decimal', { name: 'emi_amount', precision: 10, scale: 2, nullable: true })
    emiAmount: number;

    @OneToMany(() => AssertsEntity, (voucher) => voucher.voucherId)
    assert: AssertsEntity[];

    @OneToMany(() => SubDealerEntity, (voucher) => voucher.voucherId)
    subDealer: SubDealerEntity[];

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
