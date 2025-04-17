import { Gender } from "../entity/sub-dealer-staff.entity";

export class SubDealerStaffResponseDto {
    id: number;
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
    staffPhoto?: string;
    aadharNumber?: string;
    panCardNumber?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
    subDealerId?: string

    constructor(partial: Partial<SubDealerStaffResponseDto>) {
        Object.assign(this, partial);
    }
}
