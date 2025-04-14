
export class ProductTypeDto {
    id?: number;
    name?: string;
    companyCode: string;
    unitCode: string
    // productPhoto: string
    // blogImage: string;
    // description: string
    type: ProductORApplicationType;

}
export enum ProductORApplicationType {
    PRODUCT = 'PRODUCT',
    APPLICATION = 'APPLICATION',
}
