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
    
    @Column('timestamp', { name: 'dispatch_date', nullable: true })
    dispatchDate: Date;
    
    @Column('timestamp', { name: 'arrival_date',  nullable: true })
    arrivalDate: Date;
    
    @Column('timestamp', { name: 'trans_date',  nullable: true })
    transDate: Date;
    
    @Column('timestamp', { name: 'delivered_date',  nullable: true })
    deliveredDate: Date;
    
    @Column('varchar', { name: 'transUpdate_user', length: 225, nullable: true })
    transUpdateUser: string;
    
    @Column('varchar', { name: 'delivered_user', length: 225, nullable: true })
    deliveredUpdateUser: string;
    
    
    @Column({
        type: 'enum',
        enum: DispatchStatus,
        default: DispatchStatus.DISPATCHED,
    })
    status: DispatchStatus;
    
    @Column('varchar', { name: 'transport_id', length: 100, nullable: true })
    transportId: string;
    
    @Column('varchar', { name: 'package_id', length: 100, nullable: true })
    packageId: string;
    
    @Column('varchar', { name: 'receiver_name', length: 100, nullable: true })
    receiverName: string;
    
    @Column('varchar', { name: 'dispatcher_name', length: 100, nullable: true })
    dispatcherName: string;
    
    @Column('varchar', { name: 'tracking_url', length: 255, nullable: true })
    trackingURL: string;
    
    @Column('json', { name: 'dispatch_box_images', nullable: true })
    dispatchBoximage: string[]; // Store JSON string of image URLs
    
    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.dispatch, { nullable: true })
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;
        
    @ManyToOne(() => SubDealerEntity, (SubDealerEntity) => SubDealerEntity.dispatch, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealerId: SubDealerEntity;
    
    @Column('text', { name: 'dispatch_description', nullable: true })
    dispatchDescription: string;

    @Column('text', { name: 'delivery_description', nullable: true })
    deliveryDescription: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
