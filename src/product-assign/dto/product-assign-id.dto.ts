export class ProductAssignIdDto {
    id: number
    companyCode: string;
    unitCode: string
    constructor(id: number, companyCode: string,
        unitCode: string) {
        this.id = id
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}