import { Roles } from 'src/permissions/dto/role.enum';
import { PermissionEntity } from 'src/permissions/entity/permissions.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('designation')
export class DesignationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { name: 'company_code', length: 20, nullable: false })
    companyCode: string;

    @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
    unitCode: string;

    @Column('varchar', { name: 'designation', length: 20, nullable: false })
    designation: string;

    @Column({ type: 'json', name: 'roles', nullable: true })
    roles: {
        name: Roles;
        add: boolean;
        edit: boolean;
        view: boolean;
        // delete: boolean;
    }[];

    @OneToMany(() => PermissionEntity, (PermissionEntity) => PermissionEntity.designations)
    permissions: PermissionEntity[];
}
