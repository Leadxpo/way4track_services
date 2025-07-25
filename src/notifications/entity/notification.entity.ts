import { BranchEntity } from 'src/branch/entity/branch.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
export enum NotificationEnum {
    Request = "Request",
    Ticket = "Ticket",
    TechnicianWorks = "TechnicianWorks",
}

@Entity('notifications')
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'message', type: 'varchar', length: 255, nullable: true })
    message: string;

    @Column({ default: false, name: 'is_read' })
    isRead: boolean;

    @Column({
        name: 'notification_type',
        type: 'enum',
        enum: NotificationEnum
    })
    notificationType: NotificationEnum;

    @ManyToOne(() => BranchEntity, (branch) => branch.notifications, { eager: true ,nullable:true})
    @JoinColumn({ name: 'branch_id' })
    branch: BranchEntity;

    @ManyToOne(() => StaffEntity, (user) => user.notifications, { eager: true })
    @JoinColumn({ name: 'staff_id' })
    user: StaffEntity;

    @ManyToOne(() => RequestRaiseEntity, (user) => user.notifications, { eager: true })
    @JoinColumn({ name: 'request_id' })
    request: RequestRaiseEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @ManyToOne(() => SubDealerEntity, (requestRaiseEntity) => requestRaiseEntity.note, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealerId: SubDealerEntity;
  
    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    
}
