
export class WorkAllocationDto {
    id?: number;
    staffId: number;
    clientId: number;
    serviceOrProduct: string;
    otherInformation?: string;
    date: Date;
}
