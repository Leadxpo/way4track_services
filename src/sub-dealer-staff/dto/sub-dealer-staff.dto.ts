import { Gender } from "../entity/sub-dealer-staff.entity";


export class CreateSubDealerStaffDto {
    id?: number
    name: string;
    companyCode: string;
    unitCode: string;
    description?: string;
    gender: Gender;
    dob?: Date;
    email: string;
    phoneNumber?: string;
    alternateNumber?: string;
    staffId: string;
    password: string;
    aadharNumber?: string;
    panCardNumber?: string;
    address?: string;
}
