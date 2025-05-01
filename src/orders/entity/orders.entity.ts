
import { ClientEntity } from 'src/client/entity/client.entity';
import { DeviceEntity } from 'src/devices/entity/devices-entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum OrderStatus {
    PENDING = 'pending',
    ORDERSUCESS = 'success',
    ABORTED= "aborted",
    CANCELED= "cancel"
  }
  
@Entity('Orders')
export class OrderEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ name: 'total_amount', type: 'int', nullable: true })
  totalAmount: number;

  @Column({ name: 'payment_status', type: 'varchar', nullable: true })
  paymentStatus: string;

  @Column({ name: 'order_date', type: 'varchar', nullable: true })
  orderDate: string;

  @Column({ name: 'delivery_address', type: 'varchar', nullable: true })
  deliveryAddress: string;

  @Column({  type: 'enum', enum: OrderStatus,name: 'order_status', nullable: true })
  subscription: OrderStatus;

  @ManyToOne(() =>ClientEntity, (client) => client.order, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('json', { name: 'order_items' })
  orderItems: {
      name: string;
      qty:number;
      amount:number;
      deviceId:string;
      is_relay:boolean;
      network:string;
      subscriptionType:string;
      desc: string;
  }[];
}


