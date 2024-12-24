export class VendorResDto {
    id?: number;
    name: string;
    vendorPhoneNumber: string;
    alternatePhoneNumber?: string;
    productType: string;
    startingDate: Date;
    emailId: string;
    aadharNumber: string;
    address: string;
    voucherId: number;
    voucherNames: string;
    companyCode?: string;
    unitCode?: string
    constructor(
        id: number | undefined,
        name: string,
        vendorPhoneNumber: string,
        alternatePhoneNumber: string | undefined,
        productType: string,
        startingDate: Date,
        emailId: string,
        aadharNumber: string,
        address: string,
        voucherId: number,
        voucherNames: string,
        companyCode?: string,
        unitCode?: string
    ) {
        this.id = id;
        this.name = name;
        this.vendorPhoneNumber = vendorPhoneNumber;
        this.alternatePhoneNumber = alternatePhoneNumber;
        this.productType = productType;
        this.startingDate = startingDate;
        this.emailId = emailId;
        this.aadharNumber = aadharNumber;
        this.address = address;
        this.voucherId = voucherId;
        this.voucherNames = voucherNames;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
