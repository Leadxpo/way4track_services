export declare class EstimateResDto {
    id: number;
    clientId: string;
    clientName: string;
    clientAddress: string;
    clientEmail: string;
    clientPhoneNumber: string;
    buildingAddress: string;
    estimateDate: string;
    expireDate: string;
    productOrService: string;
    description: string;
    totalAmount: number;
    companyCode: string;
    unitCode: string;
    products?: {
        name: string;
        quantity: number;
        hsnCode: string;
        amount: number;
    }[];
    constructor(id: number, clientId: string, clientName: string, clientAddress: string, clientEmail: string, clientPhoneNumber: string, buildingAddress: string, estimateDate: string, expireDate: string, productOrService: string, description: string, totalAmount: number, companyCode: string, unitCode: string, products?: {
        name: string;
        quantity: number;
        hsnCode: string;
        amount: number;
    }[]);
}
