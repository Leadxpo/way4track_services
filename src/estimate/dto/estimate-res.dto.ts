
export class EstimateResDto {
    id: number;
    clientId: string;
    clientName: string;
    clientAddress: string;
    clientEmail: string;
    clientPhoneNumber: string;
    branchId: number;
    branchName: string;
    branchAddress: string;
    branchEmail: string;
    branchPhoneNumber: string;
    branchGST: string;
    buildingAddress: string;
    shippingAddress: string;
    estimateDate: Date;
    expireDate: string;
    productOrService: string;
    description: string;
    totalAmount: number;
    companyCode: string;
    unitCode: string;
    // hsnCode: string;
    products?: {
        type?: string,
        productId?: number;
        name: string; quantity: number;  costPerUnit: number, totalCost: number, hsnCode: string, 
    }[];  // Modified to include name, quantity, and amount
    estimateId?: string;
    invoiceId?: string;
    // GSTORTDS?: GSTORTDSEnum;
    SCST?: number;
    CGST?: number;
    vendorId?: number;
    vendorName?: string;
    vendorPhoneNumber?: string
    estimatePdfUrl: string;
    invoicePdfUrl: string
    constructor(
        id: number,
        clientId: string,
        clientName: string,
        clientAddress: string,
        clientEmail: string,
        clientPhoneNumber: string,
        branchId:number,
        branchName: string,
        branchAddress: string,
        branchEmail: string,
        branchPhoneNumber: string,
        branchGST: string,
        buildingAddress: string,
        shippingAddress: string,
        estimateDate: Date,
        expireDate: string,
        productOrService: string,
        description: string,
        totalAmount: number,
        companyCode: string,
        unitCode: string,
        products?: {
            type?: string,
        productId?: number;
        name: string; quantity: number;  costPerUnit: number, totalCost: number, hsnCode: string, 
        }[],  // Modified to match the structure
        estimateId?: string,
        invoiceId?: string,
        // GSTORTDS?: GSTORTDSEnum,
        SCST?: number,
        CGST?: number,
        // hsnCode?: string,
        vendorId?: number,
        vendorName?: string,
        vendorPhoneNumber?: string,
        estimatePdfUrl?: string,
        invoicePdfUrl?: string

    ) {
        this.id = id;
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientAddress = clientAddress;
        this.clientEmail = clientEmail;
        this.clientPhoneNumber = clientPhoneNumber;
        this.branchId = branchId;
        this.branchName = branchName;
        this.branchAddress = branchAddress;
        this.branchEmail = branchEmail;
        this.branchPhoneNumber = branchPhoneNumber;
        this.branchGST = branchGST;
        this.buildingAddress = buildingAddress;
        this.shippingAddress = shippingAddress;
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
        // this.GSTORTDS = GSTORTDS;
        this.SCST = SCST;
        this.CGST = CGST;
        // this.hsnCode = hsnCode;
        this.vendorId = vendorId
        this.vendorName = vendorName;
        this.vendorPhoneNumber = vendorPhoneNumber
        this.estimatePdfUrl = estimatePdfUrl
        this.invoicePdfUrl = invoicePdfUrl

    }
}
