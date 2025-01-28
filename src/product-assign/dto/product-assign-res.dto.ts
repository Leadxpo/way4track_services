export class ProductAssignResDto {
    id: number;
    staffId: string;
    staffName: string;
    branchId: number;
    branchName: string;
    productName: string;
    productType: string;
    imeiNumberFrom: string;
    imeiNumberTo: string;
    numberOfProducts: number;
    productAssignPhoto: string;
    companyCode: string;
    unitCode: string
    requestId: number
    request: string
    constructor(
        id: number,
        staffId: string,
        staffName: string,
        branchId: number,
        branchName: string,
        productName: string,
        productType: string,
        imeiNumberFrom: string,
        imeiNumberTo: string,
        numberOfProducts: number,
        productAssignPhoto: string,
        companyCode: string,
        unitCode: string,
        requestId: number,
        request: string
    ) {
        this.id = id;
        this.staffId = staffId;
        this.staffName = staffName;
        this.branchId = branchId;
        this.branchName = branchName;
        this.productName = productName;
        this.productType = productType;
        this.imeiNumberFrom = imeiNumberFrom;
        this.imeiNumberTo = imeiNumberTo;
        this.numberOfProducts = numberOfProducts;
        this.productAssignPhoto = productAssignPhoto
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.request = request
        this.requestId = requestId
    }
}
