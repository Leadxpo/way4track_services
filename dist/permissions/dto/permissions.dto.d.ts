import { StaffStatus } from "src/staff/enum/staff-status";
import { Roles } from "./role.enum";
export declare class PermissionsDto {
    id?: number;
    permissions?: Permission[];
    companyCode: string;
    unitCode: string;
    staffId?: string;
    subDealerId?: number;
    staffStatus?: StaffStatus;
    startDate?: Date;
    endDate?: Date;
}
export declare class Permission {
    name: Roles;
    add: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
}
