import { AttendanceStatus } from "../enum/attendence-status.enum";

export class GetStaffResDto {
    id: number;
    name: string;
    phoneNumber: string;
    staffId: string;
    designation: string;
    branchId: number;
    branchName: string;
    dob: Date;
    email: string;
    aadharNumber: string;
    address: string;
    joiningDate: Date;
    basicSalary: number;
    beforeExperience: Date;
    staffPhoto: string;
    constructor(
        id: number,
        name: string,
        phoneNumber: string,
        staffId: string,
        designation: string,
        branchId: number,
        branchName: string,
        dob: Date,
        email: string,
        aadharNumber: string,
        address: string,
        joiningDate: Date,
        basicSalary: number,
        beforeExperience: Date,
        staffPhoto: string
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
    }
}
