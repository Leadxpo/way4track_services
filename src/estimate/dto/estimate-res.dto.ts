export class EstimateResDto {
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
    unitCode: string
    products?: { name: string; quantity: number; hsnCode: string; amount: number }[];

    constructor(
        id: number,
        clientId: string,
        clientName: string,
        clientAddress: string,
        clientEmail: string,
        clientPhoneNumber: string,
        buildingAddress: string,
        estimateDate: string,
        expireDate: string,
        productOrService: string,
        description: string,
        totalAmount: number,
        companyCode: string,
        unitCode: string,
        products?: { name: string; quantity: number; hsnCode: string; amount: number }[]
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
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
