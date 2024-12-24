import { BaseEntity } from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
export declare class ProductAssignEntity extends BaseEntity {
    id: number;
    staffId: StaffEntity;
    branchId: BranchEntity;
    productId: ProductEntity;
    imeiNumberFrom: string;
    imeiNumberTo: string;
    numberOfProducts: number;
    requestId: RequestRaiseEntity;
    productAssignPhoto: string;
    branchOrPerson: string;
    assignedQty: number;
    isAssign: boolean;
    assignTime: Date;
    assignTo: string;
    productType: string;
    inHands: boolean;
    companyCode: string;
    unitCode: string;
}
