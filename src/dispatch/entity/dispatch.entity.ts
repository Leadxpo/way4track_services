import { ClientEntity } from 'src/client/entity/client.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum DispatchStatus {
    ON_THE_WAY = 'ON_THE_WAY',
    DISPATCHED = 'DISPATCHED',
    DELIVERED = 'DELIVERED',
}

@Entity('dispatch')
export class DispatchEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { name: 'company_code', length: 20, nullable: true })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: true })
    unitCode: string;

    @Column('varchar', { name: 'from_address', length: 255, nullable: true })
    fromAddress: string;

    @Column('varchar', { name: 'to_address', length: 255, nullable: true })
    toAddress: string;

    @Column('varchar', { name: 'dispatch_company_name', length: 100, nullable: true })
    dispatchCompanyName: string;

    @Column('timestamp', { name: 'dispatch_date', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    dispatchDate: Date;

    @Column('timestamp', { name: 'arrival_date', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    arrivalDate: Date;

    @Column({
        type: 'enum',
        enum: DispatchStatus,
        default: DispatchStatus.DISPATCHED,
    })
    status: DispatchStatus;

    @Column('varchar', { name: 'transport_id', length: 50, nullable: true })
    transportId: string;

    @Column('varchar', { name: 'package_id', length: 50, nullable: true })
    packageId: string;

    @Column('varchar', { name: 'receiver_name', length: 100, nullable: true })
    receiverName: string;

    @Column('varchar', { name: 'dispatcher_name', length: 100, nullable: true })
    dispatcherName: string;

    @Column('varchar', { name: 'tracking_url', length: 255, nullable: true })
    trackingURL: string;

    @Column('varchar', { name: 'dispatch_box_image', length: 255, nullable: true })
    dispatchBoximage: string;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.dispatch, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => ProductAssignEntity, (ProductAssignEntity) => ProductAssignEntity.dispatch, { nullable: true })
    @JoinColumn({ name: 'assigned_products_id' })
    assignedProductsId: ProductAssignEntity;

    @ManyToOne(() => ClientEntity, (ClientEntity) => ClientEntity.dispatch, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    clientId: ClientEntity;

    @ManyToOne(() => SubDealerEntity, (SubDealerEntity) => SubDealerEntity.dispatch, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealerId: SubDealerEntity;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
