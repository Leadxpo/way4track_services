import { InstallationEnum } from "../enum/installation.enum";
import { WorkStatusEnum } from "../enum/work-status-enum";

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
    productId?: number
    vendorId?: number
    voucherId?: number
    productName: string
    workStatus: WorkStatusEnum;
    description: string;
    amount: number;
    sales_id: number
    visitingNumber: string;
    branchId: number
}
export class ProductDetail {
    productName: string;
}