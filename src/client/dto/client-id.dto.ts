export class ClientIdDto {
    id: number
    clientId: string;
    companyCode: string;
    unitCode: string

    constructor(id: number, clientId: string, companyCode: string,
        unitCode: string) {
        this.id = id
        this.clientId = clientId;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
