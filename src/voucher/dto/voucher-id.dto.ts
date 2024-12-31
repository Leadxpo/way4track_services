export class VoucherIdDto {
    voucherId: string;
    companyCode?: string;
    unitCode?: string
    constructor(voucherId: string, companyCode?: string,
        unitCode?: string) {
        this.voucherId = voucherId;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}