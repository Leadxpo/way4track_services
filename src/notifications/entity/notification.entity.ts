import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
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
    Technician = "Technician"
}

@Entity('notifications')
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        name: 'notification_type',
        type: 'enum',
        enum: NotificationEnum
    })
    notificationType: NotificationEnum;

    @ManyToOne(() => BranchEntity, (branch) => branch.notifications, { eager: true })
    @JoinColumn({ name: 'branch_id' })
    branch: BranchEntity;

    @ManyToOne(() => StaffEntity, (user) => user.notifications, { eager: true })
    @JoinColumn({ name: 'staff_id' })
    user: StaffEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
