import { LeadStatusEnum } from "../entity/sales-man.entity";


export class RequirementDetailDto {
    productName: string;
    quantity: number;
}

export class ServiceDto {
    services: string;
    description: string;
}

export class SalesWorksDto {
    id?: number;
    visitingCard?: string;
    clientPhoto?: string;
    date?: Date;
    estimateDate?: Date;
    staffId?: number; // Can be changed to `number` if it's an ID reference
    allocateStaffId?: number; 
    companyCode: string;
    leadStatus:LeadStatusEnum
    unitCode: string;
    createdAt?: Date;
    updatedAt?: Date;
    paidDate?:Date;
    paidAmount?: number; 
    name?: string;
    phoneNumber?: string;
    address?: string;
    requirementDetails?: RequirementDetailDto[]
    service?: ServiceDto[];
    visitingNumber?: string;

}
