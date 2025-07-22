export class EstimateDto {
    id?: number;
    clientId: string;
    branchId: number;
    vendorId?: number;
    buildingAddress: string;
    shippingAddress: string;
    taxableState: string;
    supplyState: string;
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
    prefix?: string;
    invoicePrefix?: string;
    isGST?: boolean;
    isTDS?: boolean;
    SCST?: number;
    CGST?: number;
    TDS?: number;
    quantity: number;  // The total quantity for all products
    productDetails?: ProductDetailDto[];
    cgstPercentage: number; // For temporary use
    scstPercentage: number; // For temporary use
    tdsPercentage: number; // For temporary use
    convertToInvoice: boolean;
    estimatePdfUrl: string;
    invoicePdfUrl: string
}


export class ProductDetailDto {
    type?: string
    productId?: number;
    productName: string;
    quantity: number;
    costPerUnit: number;
    totalCost: number;
    hsnCode: string;
    description:string;
}
