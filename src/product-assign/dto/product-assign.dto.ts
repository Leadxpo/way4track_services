export class ProductAssignDto {
    id: number;
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
    assignedQty: number;
    isAssign: boolean;
    assignTime: Date;
    assignTo: string;
    productType: string;
    inHands: boolean;
}
