import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ClientStatusEnum } from 'src/client/enum/client-status.enum';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('requests')
export class RequestRaiseEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'request_id', type: 'varchar', unique: true })
    requestId: string;

    @Column({ name: 'request_type', type: 'varchar', length: 50 })
    requestType: string;

    @Column({ name: 'status', type: 'enum', enum: ClientStatusEnum, default: ClientStatusEnum.ACCEPTED })
    status: ClientStatusEnum

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.request)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => ClientEntity, (staffEntity) => staffEntity.request)
    @JoinColumn({ name: 'client_id' })
    clientID: ClientEntity;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'created_date', type: 'date' })
    createdDate: Date;

    @OneToMany(() => ProductAssignEntity, (ProductAssignEntity) => ProductAssignEntity.requestId)
    productAssign: ProductAssignEntity[];

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.request)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;
}
