import { WorkStatusEnum } from "../enum/work-status-enum";
export declare class WorkAllocationResDto {
    id: number;
    workAllocationNumber: string;
    otherInformation: string;
    date: Date;
    clientId: number;
    clientName: string;
    clientAddress: string;
    clientPhoneNumber: string;
    staffId: number;
    assignedTo: string;
    companyCode?: string;
    unitCode?: string;
    productId?: number;
    productName?: string;
    dateOfPurchase?: Date;
    vendorId?: number;
    categoryName?: string;
    productDescription?: string;
    vendorPhoneNumber?: string;
    vendorName?: string;
    vendorAddress?: string;
    vendorEmailId?: string;
    voucherId?: number;
    voucherName?: string;
    workStatus?: WorkStatusEnum;
    description?: string;
    amount: number;
    branchId?: number;
    branchName?: string;
    service?: string;
    estimateId?: string;
    invoiceId?: string;
    constructor(id: number, workAllocationNumber: string, otherInformation: string, date: Date, clientId: number, clientName: string, clientAddress: string, clientPhoneNumber: string, staffId: number, assignedTo: string, companyCode?: string, unitCode?: string, productId?: number, productName?: string, dateOfPurchase?: Date, vendorId?: number, categoryName?: string, productDescription?: string, vendorPhoneNumber?: string, vendorName?: string, vendorAddress?: string, vendorEmailId?: string, voucherId?: number, voucherName?: string, workStatus?: WorkStatusEnum, description?: string, amount?: number, branchId?: number, branchName?: string, service?: string, estimateId?: string, invoiceId?: string);
}
