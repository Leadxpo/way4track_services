import { CommonReq } from "src/models/common-req";

export class LoginDto extends CommonReq {
    staffId: string;
    password: string;
    designation?: string;
    uniqueId?: string

    constructor(
        staffId: string,
        password: string,
        unitCode: string,
        companyCode: string,
        userId?: number,
        userName?: string,
        designation?: string,
        uniqueId?: string

    ) {
        super(unitCode, companyCode, userId, userName);
        this.staffId = staffId;
        this.password = password;
        this.designation = designation;
        this.uniqueId = uniqueId
    }
}
