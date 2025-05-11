import { AddressEntity } from "src/address/entity/address.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { DeviceEntity } from "src/devices/entity/devices-entity";
import { RefundEntity } from "src/refund/entity/refund.entity";
import { TransactionEntity } from "src/transactions/entity/transactions.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

export enum OrderStatus {
  PENDING = "pending",
  ORDERSUCESS = "success",
  ABORTED = "aborted",
  CANCELED = "cancelled",
  Received = "received",
  Dispatched = "dispatched",
  Delivered = "delivered",
  request_raised = "request_raised",
  request_approved = "request_approved",
  request_reject = "request_reject",
  request_sucess = "request_sucess"
}

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", type: "varchar", length: 255, nullable: true })
  name: string;

  @Column({ name: "total_amount", type: "int", nullable: true })
  totalAmount: number;

  @Column({ name: "payment_status", type: "varchar", nullable: true })
  paymentStatus: string;

  @Column({ name: "order_date", type: "varchar", nullable: true })
  orderDate: string;

  @ManyToOne(() => AddressEntity, (client) => client.order, { nullable: true })
  @JoinColumn({ name: "delivery_address_id" })
  deliveryAddressId: AddressEntity;

  @ManyToOne(() => AddressEntity, (client) => client.orders, { nullable: true })
  @JoinColumn({ name: "building_address_id" })
  buildingAddressId: AddressEntity;

  @Column({
    type: "enum",
    enum: OrderStatus,
    name: "order_status",
    nullable: true,
    default: OrderStatus.PENDING
  })
  orderStatus: OrderStatus;

  @ManyToOne(() => ClientEntity, (client) => client.order, { nullable: true })
  @JoinColumn({ name: "client_id" })
  client: ClientEntity;

  @Column("varchar", { name: "company_code", length: 20, nullable: false })
  companyCode: string;

  @Column("varchar", { name: "unit_code", length: 20, nullable: false })
  unitCode: string;

  @Column({
    name: "delivary_date",
    type: "timestamp"
  })
  delivaryDate: Date;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(
    () => TransactionEntity,
    (TransactionEntity) => TransactionEntity.order
  )
  transactions: TransactionEntity[];

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column("json", { name: "order_items" })
  orderItems: {
    name: string;
    qty: number;
    amount: number;
    deviceId: string;
    is_relay: boolean;
    network: string;
    subscriptionType: string;
    desc: string;
  }[];


  @OneToMany(() => RefundEntity, (requestRaiseEntity) => requestRaiseEntity.order)
  refund: RefundEntity[];
}
