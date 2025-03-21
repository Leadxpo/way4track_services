import { DesignationEnum } from "src/staff/entity/staff.entity";
import { Roles } from "./role.enum";
export declare class PermissionsDto {
    id?: number;
    userId: string;
    userName: string;
    phoneNumber: string;
    permissions: PermissionDto[];
    companyCode: string;
    unitCode: string;
    designation: DesignationEnum;
    role: Roles;
}
export declare class PermissionDto {
    name: string;
    add: boolean;
    edit: boolean;
    view: boolean;
}
