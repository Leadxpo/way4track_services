import { BaseEntity } from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { ProductStatusEnum } from 'src/product/enum/product-status.enum';
import { DispatchEntity } from 'src/dispatch/entity/dispatch.entity';
import { ProductTypeEntity } from 'src/product-type/entity/product-type.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
export declare class ProductAssignEntity extends BaseEntity {
    id: number;
    staffId: StaffEntity;
    branchId: BranchEntity;
    dispatch: DispatchEntity[];
    productId: ProductEntity;
    imeiNumberFrom: string;
    imeiNumberTo: string;
    numberOfProducts: number;
    simNumberFrom: string;
    simNumberTo: string;
    requestId: RequestRaiseEntity;
    subDealerId: SubDealerEntity;
    productAssignPhoto: string;
    branchOrPerson: string;
    isAssign: string;
    assignTime: Date;
    assignTo: string;
    productTypeId: ProductTypeEntity;
    inHands: string;
    companyCode: string;
    unitCode: string;
    status: ProductStatusEnum;
    createdAt: Date;
    updatedAt: Date;
}
