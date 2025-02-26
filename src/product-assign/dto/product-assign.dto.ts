import { ProductStatusEnum } from "src/product/enum/product-status.enum";

export class ProductAssignDto {
    id?: number;
    staffId: number;
    productId: number;
    branchId: number;
    requestId: number;
    imeiNumberFrom: string;
    imeiNumberTo: string;
    numberOfProducts: number;
    branchOrPerson: string;
    productAssignPhoto?: string
    companyCode: string;
    unitCode: string
    // assignedQty: number;
    isAssign: string;
    assignTime: Date;
    assignTo: string;
    productTypeId: number;
    inHands: string;
    status?: ProductStatusEnum

}
