export class WorkAllocationResDto {
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
    assignedTo: string; // Staff name
    companyCode?: string;
    unitCode?: string
    constructor(
        id: number,
        workAllocationNumber: string,
        serviceOrProduct: string,
        otherInformation: string,
        date: Date,
        clientId: number,
        clientName: string,
        clientAddress: string,
        clientPhoneNumber: string,
        staffId: number,
        assignedTo: string,
        companyCode?: string,
        unitCode?: string
    ) {
        this.id = id;
        this.workAllocationNumber = workAllocationNumber;
        this.serviceOrProduct = serviceOrProduct;
        this.otherInformation = otherInformation;
        this.date = date;
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientAddress = clientAddress;
        this.clientPhoneNumber = clientPhoneNumber;
        this.staffId = staffId;
        this.assignedTo = assignedTo;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
