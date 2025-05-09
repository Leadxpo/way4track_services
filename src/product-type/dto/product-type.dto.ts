import { ClientStatus } from "src/client/enum/client-status.enum";

export class ProductTypeDto {
    id?: number;
    name?: string;
    companyCode: string;
    unitCode: string
    // productPhoto: string
    // blogImage: string;
    // description: string
    type: ProductORApplicationType;
    status: ClientStatus

}
export enum ProductORApplicationType {
    PRODUCT = 'PRODUCT',
    APPLICATION = 'APPLICATION',
}
