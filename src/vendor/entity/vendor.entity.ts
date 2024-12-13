import { ProductEntity } from 'src/product/entity/product.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('vendor')
export class VendorEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'vendor_id', type: 'varchar', length: 10, unique: true })
  vendorId: string;

  @Column({ name: 'vendor_phone_number', type: 'varchar', length: 15 })
  vendorPhoneNumber: string;

  @Column({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true })
  alternatePhoneNumber?: string;

  @Column({ name: 'product_type', type: 'varchar', length: 50 })
  productType: string;

  @Column({ name: 'vendor_photo', type: 'text' })
  vendorPhoto: string;

  @Column({ name: 'starting_date', type: 'date' })
  startingDate: Date;

  @Column({ name: 'email', type: 'varchar', length: 150 })
  emailId: string;

  @Column({ name: 'aadhar_number', type: 'varchar', length: 12 })
  aadharNumber: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @OneToMany(() => ProductEntity, (product) => product.vendorId)
  product: ProductEntity[];

  @ManyToOne(() => VoucherEntity, (VoucherEntity) => VoucherEntity.vendor)
  @JoinColumn({ name: 'voucher_id' })
  voucherId: VoucherEntity;
}
