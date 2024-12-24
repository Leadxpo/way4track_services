export class SubDealerResDto {
    id?: number;
    name: string;
    subDealerPhoneNumber: string;
    alternatePhoneNumber?: string;
    startingDate: Date;
    emailId: string;
    aadharNumber: string;
    address: string;
    voucherId: string;
    voucherNames: string;
    password: string;
    subDealerPhoto: string;
    subDealerId: string
    companyCode?: string;
    unitCode?: string
    constructor(
        id: number | undefined,
        name: string,
        subDealerPhoneNumber: string,
        alternatePhoneNumber: string | undefined,
        startingDate: Date,
        emailId: string,
        aadharNumber: string,
        address: string,
        voucherId: string,
        voucherNames: string,
        password: string,
        subDealerPhoto: string,
        subDealerId: string,
        companyCode?: string,
        unitCode?: string
    ) {
        this.id = id;
        this.name = name;
        this.subDealerPhoneNumber = subDealerPhoneNumber;
        this.alternatePhoneNumber = alternatePhoneNumber;
        this.startingDate = startingDate;
        this.emailId = emailId;
        this.aadharNumber = aadharNumber;
        this.address = address;
        this.voucherId = voucherId;
        this.voucherNames = voucherNames;
        this.subDealerPhoto = subDealerPhoto;
        this.subDealerId = subDealerId;
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.password = password
    }
}
