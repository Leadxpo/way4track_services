import { CommonReq } from "src/models/common-req";
import { DesignationEnum } from "src/staff/entity/staff.entity";

export class LoginDto extends CommonReq {
    staffId: string;
    password: string;
    designation: DesignationEnum;

    constructor(
        staffId: string,
        password: string,
        designation: DesignationEnum,
        unitCode: string,
        companyCode: string,
        userId?: number,
        userName?: string
    ) {
        super(unitCode, companyCode, userId, userName);
        this.staffId = staffId;
        this.password = password;
        this.designation = designation;
    }
}