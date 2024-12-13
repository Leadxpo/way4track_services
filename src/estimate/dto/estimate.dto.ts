export class EstimateDto {
    id: number;
    clientId: string;
    buildingAddress: string;
    estimateDate: string;
    expireDate: string;
    productOrService: string;
    description: string;
    totalAmount: number;
    products?: { name: string; quantity: number; hsnCode: string; amount: number }[];

    constructor(
        id: number,
        clientId: string,
        buildingAddress: string,
        estimateDate: string,
        expireDate: string,
        productOrService: string,
        description: string,
        totalAmount: number,
        products?: { name: string; quantity: number; hsnCode: string; amount: number }[]
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
    }
}
