import { ProductStatusEnum } from "src/product/enum/product-status.enum";
export declare class ProductAssignDto {
    id?: number;
    staffId: number;
    productId: number;
    branchId: number;
    requestId: number;
    imeiNumberFrom?: string;
    imeiNumberTo?: string;
    numberOfProducts: number;
    branchOrPerson: string;
    productAssignPhoto?: string;
    companyCode: string;
    unitCode: string;
    isAssign: string;
    assignTime: Date;
    assignTo: string;
    productTypeId: number;
    inHands: string;
    status?: ProductStatusEnum;
    simNumberFrom?: string;
    simNumberTo?: string;
    subDealerId?: number;
}
