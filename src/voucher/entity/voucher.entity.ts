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
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { AppointmentEntity, AppointmentStatus } from 'src/appointment/entity/appointement.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { LedgerEntity } from 'src/ledger/entity/ledger.entity';

export enum DebitORCreditEnum {
    Debit = "Debit",
    Credit = "Credit"
}

export enum TypeEnum {
    Rectifications = "Rectifications",
    Renewables = "Renewables",
    Replacements = "Replacements",
    Product_Sales = "ProductSales",
    Others = "Others"
}
@Entity('voucher')
export class VoucherEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
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

    @Column({ name: 'voucher_id', type: 'varchar', length: 50, unique: true, nullable: false })
    voucherId: string;

    @OneToMany(() => TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.voucherId)
    technician: TechnicianWorksEntity[];

    @ManyToOne(() => BranchEntity, (branch) => branch.voucher, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @ManyToOne(() => LedgerEntity, (branch) => branch.voucher, { nullable: true })
    @JoinColumn({ name: 'ledger_id' })
    ledgerId: LedgerEntity;

    // @Column({ type: 'enum', enum: RoleEnum, name: 'role', default: RoleEnum.CLIENT, nullable: true })
    // role: RoleEnum;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'purpose', type: 'varchar', length: 255, nullable: true })
    purpose: string;

    @Column({
        type: 'enum',
        name: 'payment_type',
        enum: PaymentType,
        // default: PaymentType.CASH,
        nullable: true
    })
    paymentType: PaymentType;

    @Column({ name: 'voucher_type', type: 'enum', enum: VoucherTypeEnum })
    voucherType: VoucherTypeEnum;

    @Column({ name: 'generation_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    generationDate: Date;

    // @Column({ name: 'next_due_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    // nextDueDate: Date;

    // @Column({ name: 'last_paid_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    // lastPaidDate: Date;

    @Column({ name: 'expire_date', type: 'timestamp', nullable: true })
    expireDate: Date;

    @Column({ name: 'shipping_address', type: 'varchar', length: 255, nullable: true, default: null })
    shippingAddress: string;

    @Column({ name: 'supplier_location', type: 'varchar', length: 255, nullable: true, default: null })
    supplierLocation: string;

    @Column({ name: 'building_address', type: 'varchar', length: 255, nullable: true, default: null })
    buildingAddress: string;

    @Column({ name: 'hsn_code', type: 'varchar', length: 20, nullable: true })
    hsnCode: string;

    @Column({ name: 'journal_type', type: 'enum', nullable: true, enum: DebitORCreditEnum })
    journalType: DebitORCreditEnum;

    @Column({ name: 'scst', type: 'float', nullable: true })
    SCST: number;

    @Column({ name: 'cgst', type: 'float', nullable: true })
    CGST: number;

    @Column({ name: 'voucher_gst', type: 'float', nullable: true })
    voucherGST: number;

    @Column({ name: 'igst', type: 'float', nullable: true })
    IGST: number;

    @Column({ name: 'tds', type: 'float', nullable: true })
    TDS: number;

    @Column({ name: 'tcs', type: 'float', nullable: true })
    TCS: number;

    @Column({ name: 'amount', type: 'float', nullable: true })
    amount: number;

    @Column({ name: 'credit_amount', type: 'float', nullable: true, default: null })
    creditAmount: number;

    @Column({ name: 'remining_amount', type: 'float', nullable: true })
    reminigAmount: number;

    // @Column({ name: 'emi_mount', type: 'float', nullable: true })
    // emiAmount: number;

    @ManyToOne(() => ProductEntity, (ProductEntity) => ProductEntity.voucherId, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        name: 'payment_status',
        default: PaymentStatus.PENDING,
        nullable: true
    })
    paymentStatus: PaymentStatus;

    @Column({
        type: 'enum',
        enum: ProductType,
        name: 'product_type',
        // default: ProductType.product,
        nullable: true
    })
    productType: ProductType;


    @ManyToOne(() => VendorEntity, (VendorEntity) => VendorEntity.voucherId, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendorId: VendorEntity;

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.voucherId, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @ManyToOne(() => StaffEntity, (StaffEntity) => StaffEntity.voucherId, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => StaffEntity, (StaffEntity) => StaffEntity.voucher, { nullable: true })
    @JoinColumn({ name: 'payment_to' })
    paymentTo: StaffEntity;

    // @Column('decimal', { name: 'initial_payment', precision: 10, scale: 2, nullable: true })
    // initialPayment: number;

    // @Column('int', { name: 'emi_count', nullable: true })
    // numberOfEmi: number;

    // @Column('int', { name: 'emi_number', nullable: true })
    // emiNumber: number;

    @OneToMany(() => AssertsEntity, (voucher) => voucher.voucherId)
    assert: AssertsEntity[];


    @OneToMany(() => AppointmentEntity, (voucher) => voucher.voucherId)
    appointments: AppointmentEntity[];

    @OneToMany(() => WorkAllocationEntity, (voucher) => voucher.voucherId)
    workAllocation: WorkAllocationEntity[];

    @ManyToOne(() => SubDealerEntity, (SubDealerEntity) => SubDealerEntity.voucherId, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealer: SubDealerEntity;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column('varchar', { name: 'invoice_id', length: 20, nullable: true })
    invoiceId: string;

    @ManyToOne(() => EstimateEntity, (Estimate) => Estimate.invoice, { nullable: true })
    @JoinColumn({ name: 'invoice', referencedColumnName: 'id' })
    estimate: EstimateEntity;

    @Column('decimal', { name: 'paid_amount', nullable: true })
    paidAmount: number;

    @Column({ type: 'json', name: 'product_details', nullable: true })
    productDetails: {
        type?: TypeEnum;
        productName: string;
        quantity: number;
        rate: number;
        totalCost: number;
        description?: string
    }[];

    @Column({ type: 'json', name: 'pending_invoices', nullable: true })
    pendingInvoices: {
        invoiceId: string;
        paidAmount: number;
        amount: number;
        reminigAmount: number;
        // description?: string
    }[];
}
