import { ClientStatus } from "../enum/client-status.enum";

export class ClientResDto {
    id: number;
    name: string;
    phoneNumber: string;
    clientId: string;
    userName: string;
    clientPhoto: string;
    branchId: number;
    branchName: string;
    email: string;
    address: string;
    state: string;
    companyCode: string;
    unitCode: string
    status: ClientStatus
    GSTNumber: string;

    constructor(
        id: number,
        name: string,
        phoneNumber: string,
        clientId: string,
        userName: string,
        clientPhoto: string,
        branchId: number,
        branchName: string,
        email: string,
        address: string,
        state: string,
        companyCode: string,
        unitCode: string,
        status: ClientStatus,
        GSTNumber: string

    ) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.clientId = clientId;
        this.userName = userName;
        this.clientPhoto = clientPhoto
        this.branchId = branchId;
        this.branchName = branchName;
        this.email = email;
        this.address = address;
        this.state = state;
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.status = status
        this.GSTNumber = GSTNumber
    }
}
