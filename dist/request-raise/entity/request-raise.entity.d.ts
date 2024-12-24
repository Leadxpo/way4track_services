import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ClientStatusEnum } from 'src/client/enum/client-status.enum';
import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BaseEntity } from 'typeorm';
export declare class RequestRaiseEntity extends BaseEntity {
    id: number;
    requestId: string;
    requestType: string;
    status: ClientStatusEnum;
    staffId: StaffEntity;
    clientID: ClientEntity;
    description: string;
    createdDate: Date;
    productAssign: ProductAssignEntity[];
    branchId: BranchEntity;
    companyCode: string;
    unitCode: string;
}
