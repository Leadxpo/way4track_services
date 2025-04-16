export declare class VendorResDto {
    id?: number;
    name: string;
    vendorPhoneNumber: string;
    alternatePhoneNumber?: string;
    productType: string;
    startingDate: Date;
    emailId: string;
    aadharNumber: string;
    address: string;
    companyCode?: string;
    unitCode?: string;
    vendorPhoto?: string;
    branchId: number;
    branchNames: string;
    constructor(id: number | undefined, name: string, vendorPhoneNumber: string, alternatePhoneNumber: string | undefined, productType: string, startingDate: Date, emailId: string, aadharNumber: string, address: string, companyCode?: string, unitCode?: string, vendorPhoto?: string, branchId?: number, branchNames?: string);
}
