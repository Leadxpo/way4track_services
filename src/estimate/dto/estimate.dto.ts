export class EstimateDto {
    id: number;
    clientId: string;
    buildingAddress: string;
    estimateDate: string;
    expireDate: string;
    productOrService: string;
    description: string;
    totalAmount: number;
    companyCode: string;
    unitCode: string
    products?: { name: string; quantity: number; hsnCode: string; amount: number }[];
    estimateId?: string
    constructor(
        id: number,
        clientId: string,
        buildingAddress: string,
        estimateDate: string,
        expireDate: string,
        productOrService: string,
        description: string,
        totalAmount: number,
        companyCode: string,
        unitCode: string,
        products?: { name: string; quantity: number; hsnCode: string; amount: number }[],
        estimateId?: string
    ) {
        this.id = id;
        this.clientId = clientId;
        this.buildingAddress = buildingAddress;
        this.estimateDate = estimateDate;
        this.expireDate = expireDate;
        this.productOrService = productOrService;
        this.description = description;
        this.totalAmount = totalAmount;
        this.products = products;
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.estimateId = estimateId
    }
}
