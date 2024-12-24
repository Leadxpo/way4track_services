export declare class EstimateDto {
    id: number;
    clientId: string;
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
    estimateId?: string;
    constructor(id: number, clientId: string, buildingAddress: string, estimateDate: string, expireDate: string, productOrService: string, description: string, totalAmount: number, companyCode: string, unitCode: string, products?: {
        name: string;
        quantity: number;
        hsnCode: string;
        amount: number;
    }[], estimateId?: string);
}
