export declare class EstimateResDto {
    id: number;
    clientId: string;
    clientName: string;
    clientAddress: string;
    clientEmail: string;
    clientPhoneNumber: string;
    buildingAddress: string;
    estimateDate: Date;
    expireDate: string;
    productOrService: string;
    description: string;
    totalAmount: number;
    companyCode: string;
    unitCode: string;
    products?: {
        type?: string;
        productId?: number;
        name: string;
        quantity: number;
        costPerUnit: number;
        totalCost: number;
        hsnCode: string;
    }[];
    estimateId?: string;
    invoiceId?: string;
    SCST?: number;
    CGST?: number;
    vendorId?: number;
    vendorName?: string;
    vendorPhoneNumber?: string;
    estimatePdfUrl: string;
    invoicePdfUrl: string;
    constructor(id: number, clientId: string, clientName: string, clientAddress: string, clientEmail: string, clientPhoneNumber: string, buildingAddress: string, estimateDate: Date, expireDate: string, productOrService: string, description: string, totalAmount: number, companyCode: string, unitCode: string, products?: {
        type?: string;
        productId?: number;
        name: string;
        quantity: number;
        costPerUnit: number;
        totalCost: number;
        hsnCode: string;
    }[], estimateId?: string, invoiceId?: string, SCST?: number, CGST?: number, vendorId?: number, vendorName?: string, vendorPhoneNumber?: string, estimatePdfUrl?: string, invoicePdfUrl?: string);
}
