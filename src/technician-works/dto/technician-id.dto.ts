export class TechIdDto {
    id: number
    companyCode: string;
    unitCode: string
    install?: string
    imeiNumber?: string

    constructor(id: number, companyCode: string,
        unitCode: string,
        install?: string,
        imeiNumber?: string

    ) {
        this.id = id
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.install = install
        this.imeiNumber = imeiNumber
    }
}
