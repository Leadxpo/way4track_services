import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DiscountTypeEnum {
  Amount = 'Amount',
  Percent = 'Percent',
}

export enum promoStatusEnum {
  Active = 'Active',
  Inactive = 'Inactive',
}

@Entity('promo')
export class PromoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'promocode', type: 'varchar', nullable: true })
  promocode: string;

  @Column({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ name: 'discount', type: 'decimal', precision: 10, scale: 2, nullable: false })
  discount: number;

  @Column({ type: 'enum', enum: DiscountTypeEnum, name: 'discount_type', default: DiscountTypeEnum.Amount })
  discountType: DiscountTypeEnum;

  @Column({ type: 'enum', enum: promoStatusEnum, name: 'promo_status', default: promoStatusEnum.Active })
  promoStatus: promoStatusEnum;

  @Column({ name: 'min_sale_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minSaleAmount: number;

  @Column({ name: 'max_discount_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscountAmount: number;

  @Column({ name: 'promo_users', type: 'varchar', nullable: true })
  promoUsers: string;

  @Column('varchar', { name: 'company_code', length: 20 })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20 })
  unitCode: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
