import { BranchEntity } from 'src/branch/entity/branch.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('sub_dealer')
export class SubDealerEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'sub_dealer_photo', type: 'text', nullable: true })
  subDealerPhoto: string;

  @Column({ name: 'sub_dealer_id', type: 'varchar', length: 20, unique: true })
  subDealerId: string;

  @Column({ name: 'password', type: 'varchar', length: 20, unique: true })
  password: string;

  @Column({ name: 'sub_dealer_phone_number', type: 'varchar', length: 15 })
  subDealerPhoneNumber: string;

  @Column({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true })
  alternatePhoneNumber?: string;

  @Column({ name: 'gst_number', type: 'varchar', length: 20, unique: true, nullable: true })
  gstNumber: string;

  @Column({ name: 'starting_date', type: 'date' })
  startingDate: Date;

  @Column({ name: 'email', type: 'varchar', length: 150 })
  emailId: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 20, unique: true })
  aadharNumber: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @OneToMany(() => VoucherEntity, (product) => product.subDealer)
  voucherId: VoucherEntity[];

  @OneToMany(() => RequestRaiseEntity, (product) => product.subDealerId)
  request: RequestRaiseEntity[];

  @ManyToOne(() => BranchEntity, (BranchEntity) => BranchEntity.subDealer, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;
}
