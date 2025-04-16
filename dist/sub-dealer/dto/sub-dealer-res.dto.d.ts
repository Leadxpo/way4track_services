export declare class SubDealerResDto {
    id?: number;
    name: string;
    subDealerPhoneNumber: string;
    alternatePhoneNumber?: string;
    startingDate: Date;
    emailId: string;
    aadharNumber: string;
    address: string;
    password: string;
    subDealerPhoto: string;
    subDealerId: string;
    companyCode?: string;
    unitCode?: string;
    branchId?: number;
    branchName?: string;
    constructor(id: number | undefined, name: string, subDealerPhoneNumber: string, alternatePhoneNumber: string | undefined, startingDate: Date, emailId: string, aadharNumber: string, address: string, password: string, subDealerPhoto: string, subDealerId: string, companyCode?: string, unitCode?: string, branchId?: number, branchName?: string);
}
