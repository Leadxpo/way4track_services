import { AddressEntity } from "src/address/entity/address.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { DeviceEntity } from "src/devices/entity/devices-entity";
import { OrderEntity } from "src/orders/entity/orders.entity";
import { TransactionEntity } from "src/transactions/entity/transactions.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

export enum RefundStatus {
    PENDING = "pending",
    request_recived = 'request_recived',
    request_accept = "request_accept",
    request_reject = "request_reject",
    pick_scheduled = "pick_scheduled",
    item_picked_up = "item_picked_up",
    new_item_dispatched = "new_item_dispatched",
    replaced_sucess = "replaced_sucess",
    returning = "returning" // or use "return_in_transit"
}

@Entity("refund")
export class RefundEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "name", type: "varchar", length: 255, nullable: true })
    name: string;

    @Column({ name: "product_name", type: "varchar", length: 255, nullable: true })
    productName: string;

    @Column({ name: "phone_number", type: "int", nullable: true })
    phoneNumber: number;

    @Column({ name: "date_of_request", type: "varchar", nullable: true })
    dateOfRequest: string;

    @Column({ name: "date_of_replace", type: "varchar", nullable: true })
    dateOfReplace: string;

    @Column({ name: "damage_image", type: "varchar", nullable: true })
    damageImage: string;

    @Column({
        type: "enum",
        enum: RefundStatus,
        name: "refund_status",
        nullable: true,
        default: RefundStatus.PENDING
    })
    refundStatus: RefundStatus;

    @ManyToOne(() => ClientEntity, (client) => client.order, { nullable: true })
    @JoinColumn({ name: "client_id" })
    clientId: ClientEntity;

    @ManyToOne(() => TransactionEntity, (client) => client.refund, { nullable: true })
    @JoinColumn({ name: "transaction_id" })
    transactionId: TransactionEntity;

    @ManyToOne(() => DeviceEntity, (client) => client.refund, { nullable: true })
    @JoinColumn({ name: "device_id" })
    deviceId: DeviceEntity;
    @Column({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    createdAt: Date;

    @Column({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt: Date;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => OrderEntity, (client) => client.refund, { nullable: true })
    @JoinColumn({ name: "order_id" })
    order: OrderEntity;
}
