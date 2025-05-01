
import { ClientEntity } from 'src/client/entity/client.entity';
import { DeviceEntity } from 'src/devices/entity/devices-entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum SubscriptionType {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
  }
  
@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ name: 'quantity', type: 'number', nullable: true })
  quantity: number;

  @Column({ name: 'is_relay', type: 'boolean', nullable: true })
  isRelay: boolean;

  @Column({ name: 'network', type: 'varchar', nullable: true })
  network: string;

  @Column({ name: 'pincode', type: 'varchar', nullable: true })
  pincode: string;

  @Column({  type: 'enum', enum: SubscriptionType,name: 'subscription', nullable: true })
  subscription: SubscriptionType;

  @Column({ name: 'tolal_amount', type: 'varchar', nullable: true })
  total_amount: string;

  @ManyToOne(() =>ClientEntity, (client) => client.id, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() =>DeviceEntity, (device) => device.id, { nullable: true })
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;

  @Column('varchar', { name: 'company_code', length: 20, nullable: false })
  companyCode: string;

  @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
  unitCode: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
