import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sub-dealer')
export class SubDealerEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'sub_dealer_photo', type: 'text'})
  subDealerPhoto: string;

  @Column({ name: 'sub_dealer_id', type: 'varchar', length: 10, unique: true })
  subDealerId: string;

  @Column({ name: 'sub_dealer_phone_number', type: 'varchar', length: 15 })
  subDealerPhoneNumber: string;

  @Column({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true })
  alternatePhoneNumber?: string;

  @Column({ name: 'gst_number', type: 'varchar', length: 20, unique: true })
  gstNumber: string;

  @Column({ name: 'starting_date', type: 'date' })
  startingDate: Date;

  @Column({ name: 'email', type: 'varchar', length: 150 })
  emailId: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 12 })
  aadharNumber: string;

  @Column({ name: 'address', type: 'text' })
  address: string;


  @ManyToOne(() => VoucherEntity, (VoucherEntity) => VoucherEntity.subDealer)
  @JoinColumn({ name: 'voucher_id' })
  voucherId: VoucherEntity;
}
