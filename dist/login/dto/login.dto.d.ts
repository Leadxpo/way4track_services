import { CommonReq } from "src/models/common-req";
import { DesignationEnum } from "src/staff/entity/staff.entity";
export declare class LoginDto extends CommonReq {
    staffId: string;
    password: string;
    designation: DesignationEnum;
    constructor(staffId: string, password: string, designation: DesignationEnum, unitCode: string, companyCode: string, userId?: number, userName?: string);
}
