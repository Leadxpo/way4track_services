export declare class EstimateDto {
    id?: number;
    clientId: string;
    vendorId?: number;
    buildingAddress: string;
    estimateDate: Date;
    expireDate: string;
    productOrService?: string;
    description: string;
    totalAmount: number;
    companyCode: string;
    unitCode: string;
    estimateId?: string;
    invoiceId?: string;
    SCST?: number;
    CGST?: number;
    quantity: number;
    productDetails?: ProductDetailDto[];
    cgstPercentage: number;
    scstPercentage: number;
    convertToInvoice: boolean;
    estimatePdfUrl: string;
    invoicePdfUrl: string;
}
export declare class ProductDetailDto {
    type?: string;
    productId?: number;
    productName: string;
    quantity: number;
    costPerUnit: number;
    totalCost: number;
    hsnCode: string;
}
