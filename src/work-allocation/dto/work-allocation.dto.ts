import { InstallationEnum } from "../enum/installation.enum";

export class WorkAllocationDto {
    id?: number;
    staffId: number;
    clientId: number;
    serviceOrProduct: string;
    otherInformation?: string;
    date: Date;
    companyCode?: string;
    unitCode?: string
    workAllocationNumber?: string
    install?: boolean
    productId?: number
    vendorId?: number
    voucherId?: string
    imeiNumber?: string
    productDetails?: ProductDetail[];
}
export class ProductDetail {
    productId: number;
    productName: string;
    imeiNumber: string;
    install: boolean;
}