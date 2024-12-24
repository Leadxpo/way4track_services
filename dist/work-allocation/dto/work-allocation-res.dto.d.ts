export declare class WorkAllocationResDto {
    id: number;
    workAllocationNumber: string;
    serviceOrProduct: string;
    otherInformation: string;
    date: Date;
    clientId: number;
    clientName: string;
    clientAddress: string;
    clientPhoneNumber: string;
    staffId: number;
    assignedTo: string;
    companyCode?: string;
    unitCode?: string;
    constructor(id: number, workAllocationNumber: string, serviceOrProduct: string, otherInformation: string, date: Date, clientId: number, clientName: string, clientAddress: string, clientPhoneNumber: string, staffId: number, assignedTo: string, companyCode?: string, unitCode?: string);
}
