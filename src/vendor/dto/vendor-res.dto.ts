export class VendorResDto {
    id?: number;
    name: string;
    vendorPhoneNumber: string;
    alternatePhoneNumber?: string;
    // productType: string;
    // startingDate: Date;
    // aadharNumber: string;
    emailId: string;
    state: string;
    address: string;
    GSTNumber:string;
    bankDetails:string;
    companyCode?: string;
    unitCode?: string
    vendorPhoto?: string
    branchId: number;
    branchNames: string;
    constructor(
        id: number | undefined,
        name: string,
        vendorPhoneNumber: string,
        alternatePhoneNumber: string | undefined,
        // productType: string,
        // startingDate: Date,
        // aadharNumber: string,
        emailId: string,
        state: string,
        address: string,
        GSTNumber: string,
        bankDetails: string,
        companyCode?: string,
        unitCode?: string,
        vendorPhoto?: string,
        branchId?: number,
        branchNames?: string
    ) {
        this.id = id;
        this.name = name;
        this.vendorPhoneNumber = vendorPhoneNumber;
        this.alternatePhoneNumber = alternatePhoneNumber;
        // this.productType = productType;
        // this.startingDate = startingDate;
        // this.aadharNumber = aadharNumber;
        this.emailId = emailId;
        this.state = state;
        this.address = address;
        this.GSTNumber = GSTNumber;
        this.bankDetails = bankDetails;
        this.companyCode = companyCode
        this.unitCode = unitCode;
        this.vendorPhoto = vendorPhoto;
        this.branchId = branchId
        this.branchNames = branchNames
    }
}
