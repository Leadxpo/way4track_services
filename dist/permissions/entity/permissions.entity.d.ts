import { Roles } from '../dto/role.enum';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { StaffStatus } from 'src/staff/enum/staff-status';
export declare class PermissionEntity {
    id: number;
    permissions: Permission[];
    role: Roles;
    companyCode: string;
    unitCode: string;
    staffId: StaffEntity;
    subDealerId: SubDealerEntity;
    staffStatus: StaffStatus;
    startDate: Date;
    endDate: Date;
}
export declare class Permission {
    name: Roles;
    add: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
}
