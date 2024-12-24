export class CommonReq {
    unitCode: string;
    companyCode: string;
    userId: number;
    userName: string;

    constructor(unitCode: string, companyCode: string, userId?: number, userName?: string) {
        this.unitCode = unitCode;
        this.companyCode = companyCode;
        this.userId = userId
        this.userName = userName 
    }
}
