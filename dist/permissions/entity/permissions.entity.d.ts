import { DesignationEnum } from 'src/staff/entity/staff.entity';
import { Roles } from '../dto/role.enum';
export declare class PermissionEntity {
    id: number;
    userId: string;
    userName: string;
    phoneNumber: string;
    permissions: Permission[];
    designation: DesignationEnum;
    role: Roles;
    companyCode: string;
    unitCode: string;
}
export declare class Permission {
    name: string;
    add: boolean;
    edit: boolean;
    view: boolean;
}
