// import { DesignationEnum, StaffEntity } from 'src/staff/entity/staff.entity';
// import {
//     Column,
//     Entity,
//     JoinColumn,
//     ManyToOne,
//     PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Roles } from '../dto/role.enum';

// @Entity('permissions')
// export class PermissionEntity {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({
//         type: 'json',
//         name: 'permissions',
//         nullable: false,
//         comment: 'Array of permissions with add, edit, and view flags',
//     })
//     permissions: Permission[];

//     @Column({
//         name: 'role',
//         type: 'enum',
//         enum: Roles
//     })
//     role: Roles;

//     @Column('varchar', { name: 'company_code', length: 20, nullable: false })
//     companyCode: string;

//     @Column('varchar', { name: 'unit_code', length: 20, nullable: false })
//     unitCode: string;

//     @ManyToOne(() => StaffEntity, (staffEntity) => staffEntity.permissions)
//     @JoinColumn({ name: 'staff_id' })
//     staffId: StaffEntity;
// }

// export class Permission {

//     @Column({
//         name: 'name',
//         type: 'enum',
//         enum: Roles
//     })
//     name: Roles;


//     @Column({ type: 'boolean', default: false, nullable: false, name: 'add' })
//     add: boolean;

//     @Column({ type: 'boolean', default: false, nullable: false, name: 'edit' })
//     edit: boolean;

//     @Column({ type: 'boolean', default: false, nullable: false, name: 'view' })
//     view: boolean;

//     @Column({ type: 'boolean', default: false, nullable: false, name: 'delete' })
//     delete: boolean;
// }

import { StaffEntity } from 'src/staff/entity/staff.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from '../dto/role.enum';

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
}

export class Permission {
    name: Roles;
    add: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
}
