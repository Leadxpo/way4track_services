import { InstallationEnum } from "../enum/installation.enum";
import { WorkStatusEnum } from "../enum/work-status-enum";

export class WorkAllocationDto {
    id?: number;
    staffId: string;
    clientId: number;
    // serviceOrProduct: string;
    otherInformation?: string;
    date: Date;
    companyCode?: string;
    unitCode?: string
    workAllocationNumber?: string
    install?: boolean
    productId?: number
    vendorId?: number
    voucherId?: string
    // imeiNumber?: string
    productDetails?: ProductDetail[];
    workStatus: WorkStatusEnum;
    description: string;

}
export class ProductDetail {
    productId: number;
    productName: string;
    imeiNumber: string;
    install: boolean;
}