import { GSTORTDSEnum } from "src/voucher/entity/voucher.entity";

export class EstimateResDto {
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
    hsnCode: string;
    products?: {
        name: string; quantity: number; amount: number, costPerUnit: number, totalCost: number, hsnCode: string
    }[];  // Modified to include name, quantity, and amount
    estimateId?: string;
    invoiceId?: string;
    GSTORTDS?: GSTORTDSEnum;
    SCST?: number;
    CGST?: number;

    constructor(
        id: number,
        clientId: string,
        clientName: string,
        clientAddress: string,
        clientEmail: string,
        clientPhoneNumber: string,
        buildingAddress: string,
        estimateDate: Date,
        expireDate: string,
        productOrService: string,
        description: string,
        totalAmount: number,
        companyCode: string,
        unitCode: string,
        products?: { name: string; quantity: number; amount: number, costPerUnit: number, totalCost: number, hsnCode: string }[],  // Modified to match the structure
        estimateId?: string,
        invoiceId?: string,
        GSTORTDS?: GSTORTDSEnum,
        SCST?: number,
        CGST?: number,
        hsnCode?: string
    ) {
        this.id = id;
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientAddress = clientAddress;
        this.clientEmail = clientEmail;
        this.clientPhoneNumber = clientPhoneNumber;
        this.buildingAddress = buildingAddress;
        this.estimateDate = estimateDate;
        this.expireDate = expireDate;
        this.productOrService = productOrService;
        this.description = description;
        this.totalAmount = totalAmount;
        this.products = products;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.estimateId = estimateId;
        this.invoiceId = invoiceId;
        this.GSTORTDS = GSTORTDS;
        this.SCST = SCST;
        this.CGST = CGST;
        this.hsnCode = hsnCode;
    }
}
