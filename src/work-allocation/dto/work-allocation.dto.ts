
export class WorkAllocationDto {
    id?: number;
    staffId: number;
    clientId: number;
    serviceOrProduct: string;
    otherInformation?: string;
    date: Date;
    companyCode?: string;
    unitCode?: string
    workAllocationNumber?: string
    install: boolean
    productId?: number
    vendorId?: number
}
