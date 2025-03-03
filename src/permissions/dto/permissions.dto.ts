import { Roles } from "./role.enum";

export class PermissionsDto {
    id?: number;
    permissions?: Permission[];
    companyCode: string;
    unitCode: string;
    staffId?: string;
    subDealerId?:number
    designations?:string
     // Staff ID used to find the related StaffEntity
}

export class Permission {
    name: Roles;
    add: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
}
