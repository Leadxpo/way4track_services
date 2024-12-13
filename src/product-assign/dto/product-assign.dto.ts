export class ProductAssignDto {
    id: number;
    staffId: number;
    productId: number;
    branchId: number;
    imeiNumberFrom: string;
    imeiNumberTo: string;
    numberOfProducts: number;
    branchOrPerson: string;
    productAssignPhoto?: string
}
