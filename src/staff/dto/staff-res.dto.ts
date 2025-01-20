import { DesignationEnum } from "../entity/staff.entity";
import { AttendanceStatus } from "../enum/attendence-status.enum";

export class GetStaffResDto {
    id: number;
    name: string;
    phoneNumber: string;
    staffId: string;
    designation: DesignationEnum;
    branchId: number;
    branchName: string;
    dob: string;
    email: string;
    aadharNumber: string;
    address: string;
    joiningDate: string;
    basicSalary: number;
    beforeExperience: number;
    staffPhoto: string;
    companyCode: string;
    unitCode: string;
    constructor(
        id: number,
        name: string,
        phoneNumber: string,
        staffId: string,
        designation: DesignationEnum,
        branchId: number,
        branchName: string,
        dob: string,
        email: string,
        aadharNumber: string,
        address: string,
        joiningDate: string,
        basicSalary: number,
        beforeExperience: number,
        staffPhoto: string,
        companyCode: string,
        unitCode: string,
    ) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.staffId = staffId;
        this.designation = designation;
        this.branchId = branchId;
        this.branchName = branchName;
        this.dob = dob;
        this.email = email;
        this.aadharNumber = aadharNumber;
        this.address = address;
        this.joiningDate = joiningDate;
        this.basicSalary = basicSalary;
        this.beforeExperience = beforeExperience
        this.staffPhoto = staffPhoto
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
