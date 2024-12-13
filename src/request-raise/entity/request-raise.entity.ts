import { BranchEntity } from 'src/branch/entity/branch.entity';
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

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.request)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @Column({ name: 'request_to', type: 'varchar', length: 100 })
    requestTo: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'created_date', type: 'date' })
    createdDate: Date;

    @OneToMany(() => ProductAssignEntity, (ProductAssignEntity) => ProductAssignEntity.requestId)
    productAssign: ProductAssignEntity[];

    @ManyToOne(() => BranchEntity, (branchEntity) => branchEntity.request)
    @JoinColumn({ name: 'branch_id' })
    branchId: BranchEntity;
}
