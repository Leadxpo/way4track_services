import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientStatusEnum } from 'src/client/enum/client-status.enum';
import { NotificationEntity } from 'src/notifications/entity/notification.entity';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { BaseEntity } from 'typeorm';
import { RequestTypeProducts } from '../dto/request-raise.dto';
export declare enum RequestType {
    assets = "assets",
    money = "money",
    products = "products",
    personal = "personal",
    leave_request = "leaveRequest"
}
export declare class RequestRaiseEntity extends BaseEntity {
    id: number;
    requestId: string;
    requestType: RequestType;
    status: ClientStatusEnum;
    staffId: StaffEntity;
    requestFrom: StaffEntity;
    requestTo: StaffEntity;
    subDealerId: SubDealerEntity;
    description: string;
    requestFor: string;
    createdDate: Date;
    createdAt: Date;
    updatedAt: Date;
    productAssign: ProductAssignEntity[];
    branchId: BranchEntity;
    companyCode: string;
    unitCode: string;
    notifications: NotificationEntity[];
    products: RequestTypeProducts[];
    fromDate: Date;
    toDate: Date;
}
