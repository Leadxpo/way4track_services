import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { PaymentType } from '../enum/payment-type.enum';

export enum AssetType {
    OFFICE_ASSET = 'office asset',
    TRANSPORT_ASSET = 'transport asset',
}

@Entity('asserts')
export class AssertsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'asserts_name', type: 'varchar', length: 100 })
    assertsName: string;

    @Column({ name: 'asserts_photo', type: 'text' })
    assetPhoto: string;

    @Column({ name: 'asserts_amount', type: 'float' })
    assertsAmount: number;

    @Column({
        type: 'enum',
        enum: AssetType,
        name: 'asset_type',
        default: AssetType.OFFICE_ASSET,
    })
    assetType: AssetType;

    @Column({ name: 'quantity', type: 'int' })
    quantity: number;

    @ManyToOne(() => BranchEntity, (branch) => branch.asserts)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'purchase_date', type: 'timestamp' })
    purchaseDate: Date;

    @ManyToOne(() => VoucherEntity, (voucher) => voucher.assert)
    @JoinColumn({ name: 'voucher_id' })
    voucherId: VoucherEntity;

    @Column({ name: 'initial_payment', type: 'float', nullable: true })
    initialPayment: number;

    @Column({ name: 'number_of_emi', type: 'int', nullable: true })
    numberOfEmi: number;

    @Column({ name: 'emi_amount', type: 'float', nullable: true })
    emiAmount: number;

    @Column({
        type: 'enum',
        enum: PaymentType,
        name: 'payment_type',
        default: PaymentType.EMI,
    })
    paymentType: PaymentType;
}