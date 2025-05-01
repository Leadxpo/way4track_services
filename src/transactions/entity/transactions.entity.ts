
import { ClientEntity } from 'src/client/entity/client.entity';
import { OrderEntity } from 'src/orders/entity/orders.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum OrderStatus {
    PENDING = 'pending',
    ORDERSUCESS = 'success',
    ABORTED= "aborted",
    CANCELED= "cancel"
  }
  
@Entity('transaction')
export class transactionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'transaction_id', type: 'number', nullable: true })
  transactionId: number;

  @Column({ name: 'total_amount', type: 'number', nullable: true })
  totalAmount: number;

  @Column({ name: 'payment_method', type: 'varchar', nullable: true })
  paymentMethod: string;

  @Column({ name: 'payment_status', type: 'varchar', nullable: true })
  paymentStatus: string;

  @Column({ name: 'delivery_address', type: 'varchar', nullable: true })
  deliveryAddress: string;

  @ManyToOne(() =>ClientEntity, (client) => client.id, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() =>OrderEntity, (order) => order.id, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
