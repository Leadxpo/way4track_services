

class RequirementDetailDto {
    productName: string;
    quantity: number;
}

class ServiceDto {
    services: string;
    description: string;
}

export class SalesWorksDto {
    id?: number;
    visitingCard?: string;
    clientPhoto?: string;
    date?: Date;
    estimateDate?: Date;
    staffId?: string; // Can be changed to `number` if it's an ID reference
    companyCode: string;
    unitCode: string;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    phoneNumber?: string;
    address?: string;
    requirementDetails?: RequirementDetailDto[]
    service?: ServiceDto[];
    visitingNumber?: string;

}
