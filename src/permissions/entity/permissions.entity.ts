import { DesignationEnum } from 'src/staff/entity/staff.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from '../dto/role.enum';

@Entity('permissions')
export class PermissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, name: 'user_id', nullable: false })
    userId: string;

    @Column({ type: 'varchar', length: 100, name: 'user_name', nullable: false })
    userName: string;

    @Column({ type: 'varchar', length: 15, name: 'phone_number', nullable: false })
    phoneNumber: string;

    @Column({
        type: 'json',
        name: 'permissions',
        nullable: false,
        comment: 'Array of permissions with add, edit, and view flags',
    })
    permissions: Permission[];

    @Column({
        name: 'designation',
        type: 'enum',
        enum: DesignationEnum
    })
    designation: DesignationEnum;

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
}

export class Permission {
    @Column({ type: 'varchar', length: 100, nullable: false, name: 'name' })
    name: string;

    @Column({ type: 'boolean', default: false, nullable: false, name: 'add' })
    add: boolean;

    @Column({ type: 'boolean', default: false, nullable: false, name: 'edit' })
    edit: boolean;

    @Column({ type: 'boolean', default: false, nullable: false, name: 'view' })
    view: boolean;
}
