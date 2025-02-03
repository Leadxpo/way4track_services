import { GSTORTDSEnum } from "src/voucher/entity/voucher.entity";

export class EstimateDto {
    id: number;
    clientId: string;
    vendorId:number;
    buildingAddress: string;
    estimateDate: Date;
    expireDate: string;
    productOrService: string;
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
    hsnCode?: string;
    productDetails?: ProductDetailDto[];
    cgstPercentage: number; // For temporary use
    scstPercentage: number; // For temporary use
    convertToInvoice: boolean;  // Modified to use ProductDetailDto
}


export class ProductDetailDto {
    productId: number;
    productName: string;
    quantity: number;
    costPerUnit: number;
    totalCost: number;
    hsnCode: string;
}
