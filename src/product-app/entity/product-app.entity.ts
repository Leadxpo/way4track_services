
import { WebsiteProductEntity } from 'src/website-product/entity/website-entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum OrderStatus {
    PENDING = 'pending',
    ORDERSUCESS = 'success',
    ABORTED= "aborted",
    CANCELED= "cancel"
  }
  
@Entity('cart')
export class transactionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  @Column({ name: 'image', type: 'varchar', nullable: true })
  image: string;

  @Column({ name: 'short_description', type: 'varchar', nullable: true })
  shortDescription: string;

  @ManyToOne(() =>WebsiteProductEntity, (webProduct) => webProduct.id, { nullable: true })
  @JoinColumn({ name: 'webProduct_id' })
  webProduct: WebsiteProductEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('json', { name: 'points' })
  orderItems: {
      title: string; desc: string;
  }[];
}
