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
import { StaffEntity } from 'src/staff/entity/staff.entity';

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

    @Column({ name: 'asserts_photo', type: 'text', nullable: true })
    assetPhoto: string;

    @Column({ name: 'asserts_amount', type: 'float', nullable: true })
    assertsAmount: number;

    @Column({ name: 'taxable_amount', type: 'float', nullable: true })
    taxableAmount: number;

    @Column({
        type: 'enum',
        enum: AssetType,
        name: 'asset_type',
        default: AssetType.OFFICE_ASSET,
    })
    assetType: AssetType;

    @Column({ name: 'quantity', type: 'int', nullable: true })
    quantity: number;

    @ManyToOne(() => BranchEntity, (branch) => branch.asserts)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'purchase_date', type: 'timestamp', nullable: true })
    purchaseDate: Date;

    @ManyToOne(() => VoucherEntity, (voucher) => voucher.assert, { nullable: true })
    @JoinColumn({ name: 'voucher_id' })
    voucherId: VoucherEntity;

    @Column({
        type: 'enum',
        name: 'payment_type',
        enum: PaymentType,
    })
    paymentType: PaymentType;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.assert)
    @JoinColumn({ name: 'created_by' })
    createdBy: StaffEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
}
