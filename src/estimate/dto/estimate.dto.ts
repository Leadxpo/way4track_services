import { GSTORTDSEnum } from "../entity/estimate.entity";

export class EstimateDto {
    id?: number;
    clientId: string;
    branchId: number;
    vendorId?: number;
    buildingAddress: string;
    shippingAddress: string;
    estimateDate: Date;
    accountId:string;
    expireDate: string;
    productOrService?: string;
    description: string;
    totalAmount: number;
    companyCode: string;
    unitCode: string;
    estimateId?: string;
    invoiceId?: string;
    GSTORTDS?: GSTORTDSEnum;
    SCST?: number;
    CGST?: number;
    quantity: number;  // The total quantity for all products
    // hsnCode?: string;
    productDetails?: ProductDetailDto[];
    cgstPercentage: number; // For temporary use
    scstPercentage: number; // For temporary use
    convertToInvoice: boolean;
    estimatePdfUrl: string;
    invoicePdfUrl: string
    // Modified to use ProductDetailDto
}


export class ProductDetailDto {
    type?: string
    productId?: number;
    productName: string;
    quantity: number;
    costPerUnit: number;
    totalCost: number;
    hsnCode: string;
}
