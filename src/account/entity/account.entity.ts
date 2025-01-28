
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';


export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
}

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'account_name', type: 'varchar', length: 255 })
  accountName: string;

  @Column('decimal', { name: 'total_amount', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ type: 'enum', enum: AccountType, name: 'account_type' })
  accountType: AccountType;

  @Column({ name: 'account_number', type: 'varchar' })
  accountNumber: string;

  @ManyToOne(() => BranchEntity, (branch) => branch.accounts, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @Column({ name: 'ifsc_code', type: 'varchar', length: 11 })
  ifscCode: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @OneToMany(() => VoucherEntity, (voucher) => voucher.fromAccount)
  vouchersFrom: VoucherEntity[];

  @OneToMany(() => VoucherEntity, (voucher) => voucher.toAccount)
  vouchersTo: VoucherEntity[];

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
