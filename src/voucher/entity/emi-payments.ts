import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('emi_payments')
export class EmiPaymentEntity {
    @PrimaryGeneratedColumn('uuid')
    emiPaymentId: string;

    @Column({ name: 'voucher_id', type: 'varchar' })
    voucherId: string;

    // @ManyToOne(() => VoucherEntity, (VoucherEntity) => VoucherEntity.voucherId, { nullable: true })
    // @JoinColumn({ name: 'voucher_id' })
    // voucherId: VoucherEntity;
    @Column({ name: 'emi_number', type: 'varchar' })
    emiNumber: number;

    @Column('decimal', { name: 'paid_amount' })
    paidAmount: number;

    @Column({ type: 'timestamp', name: 'payment_date' })
    paymentDate: Date;

    @Column({ type: 'decimal', name: 'remaining_balance' })
    remainingBalance: number;

    // @Column({
    //     type: 'enum',
    //     enum: PaymentType,
    //     default: PaymentType.BANK,
    //     name: 'payment_mode'
    // })
    // paymentMode: PaymentType;
}
