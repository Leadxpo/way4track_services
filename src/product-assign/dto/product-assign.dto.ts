export class ProductAssignDto {
    id: number;
    staffId: string;
    productId: number;
    branchId: number;
    imeiNumberFrom: string;
    imeiNumberTo: string;
    numberOfProducts: number;
    branchOrPerson: string;
    productAssignPhoto?: string
    companyCode: string;
    unitCode: string
}
