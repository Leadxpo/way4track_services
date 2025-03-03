import { StaffEntity } from 'src/staff/entity/staff.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from '../dto/role.enum';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { DesignationEntity } from 'src/designation/entity/designation.entity';

@Entity('permissions')
export class PermissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'json',
        name: 'permissions',
        nullable: true,
        comment: 'Array of permissions with add, edit, view, and delete flags',
    })
    permissions: Permission[];

    @Column({
        name: 'role',
        type: 'enum',
        enum: Roles
    })
    role: Roles;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.permissions)
    @JoinColumn({ name: 'staff_id' })
    staffId: StaffEntity;

    @ManyToOne(() => DesignationEntity, (DesignationEntity) => DesignationEntity.permissions)
    @JoinColumn({ name: 'designations' })
    designations: DesignationEntity;

    @ManyToOne(() => SubDealerEntity, (SubDealerEntity) => SubDealerEntity.permissions)
    @JoinColumn({ name: 'sub_dealer_id' })
    subDealerId: SubDealerEntity;

  
}

export class Permission {
    name: Roles;
    add: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
}
