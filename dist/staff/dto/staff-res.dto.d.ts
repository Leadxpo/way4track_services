import { DesignationEnum } from "../entity/staff.entity";
export declare class GetStaffResDto {
    id: number;
    name: string;
    phoneNumber: string;
    staffId: string;
    designation: DesignationEnum;
    branchId: number;
    branchName: string;
    dob: Date;
    email: string;
    aadharNumber: string;
    address: string;
    joiningDate: Date;
    basicSalary: number;
    beforeExperience: number;
    staffPhoto: string;
    companyCode: string;
    unitCode: string;
    constructor(id: number, name: string, phoneNumber: string, staffId: string, designation: DesignationEnum, branchId: number, branchName: string, dob: Date, email: string, aadharNumber: string, address: string, joiningDate: Date, basicSalary: number, beforeExperience: number, staffPhoto: string, companyCode: string, unitCode: string);
}
