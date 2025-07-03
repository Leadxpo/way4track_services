import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ClientStatusEnum } from 'src/client/enum/client-status.enum';
import { NotificationEntity } from 'src/notifications/entity/notification.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { RequestTypeProducts } from '../dto/request-raise.dto';
export enum RequestType {
    assets = "assets",
    money = "money",
    products = "products",
    personal = "personal",
    leave_request = "leaveRequest"
}
@Entity('requests')
export class RequestRaiseEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'request_id', type: 'varchar', unique: true })
    requestId: string;

    @Column({ name: 'request_type', type: 'enum', enum: RequestType, default: RequestType.money })
    requestType: RequestType

    @Column({ name: 'image', type: 'varchar', nullable: true })
    image: string;
  
    @Column({ name: 'status', type: 'enum', enum: ClientStatusEnum, default: ClientStatusEnum.pending })
    status: ClientStatusEnum

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.request)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => StaffEntity, (account) => account.staffFrom, { nullable: true })
    @JoinColumn({ name: 'request_from' })
    requestFrom: StaffEntity;

    @ManyToOne(() => StaffEntity, (account) => account.staffTo, { nullable: true })
    @JoinColumn({ name: 'request_to' })
    requestTo: StaffEntity;

    @ManyToOne(() => SubDealerEntity, (staffEntity) => staffEntity.request, { nullable: true })
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealerId: SubDealerEntity;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'request_for', type: 'text', nullable: true })
    requestFor: string;

    @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => ProductAssignEntity, (ProductAssignEntity) => ProductAssignEntity.requestId)
    productAssign: ProductAssignEntity[];

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.request)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column('varchar', { name: 'company_code', length: 200, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 200, nullable: false })
    unitCode: string;

    @OneToMany(() => NotificationEntity, (NotificationEntity) => NotificationEntity.request)
    notifications: NotificationEntity[];

    @Column({ type: 'json', name: 'products', nullable: true })
    products: RequestTypeProducts[];

    @Column({ name: 'from_date', type: 'timestamp', nullable: true })
    fromDate: Date;

    @Column({ name: 'to_date', type: 'timestamp', nullable: true })
    toDate: Date;
}
