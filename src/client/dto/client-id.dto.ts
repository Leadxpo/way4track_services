export class ClientIdDto {
    clientId: string;
    companyCode: string;
    unitCode: string
    constructor(clientId: string, companyCode: string,
        unitCode: string) {
        this.clientId = clientId;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
