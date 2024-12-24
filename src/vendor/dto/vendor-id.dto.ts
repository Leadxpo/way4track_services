export class VendorIdDto {
    vendorId: string;
    companyCode?: string;
    unitCode?: string
    constructor(vendorId: string, companyCode?: string,
        unitCode?: string) {
        this.vendorId = vendorId;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
