import { ClientStatus } from "../enum/client-status.enum";

export class ClientResDto {
    id: number;
    name: string;
    phoneNumber: string;
    clientId: string;
    clientPhoto: string;
    branchId: number;
    branchName: string;
    // dob: string;
    email: string;
    address: string;
    joiningDate: string;
    companyCode: string;
    unitCode: string
    status: ClientStatus

    constructor(
        id: number,
        name: string,
        phoneNumber: string,
        clientId: string,
        clientPhoto: string,
        branchId: number,
        branchName: string,
        // dob: string,
        email: string,
        address: string,
        joiningDate: string,
        companyCode: string,
        unitCode: string,
        status: ClientStatus

    ) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.clientId = clientId;
        this.clientPhoto = clientPhoto
        this.branchId = branchId;
        this.branchName = branchName;
        // this.dob = dob;
        this.email = email;
        this.address = address;
        this.joiningDate = joiningDate;
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.status = status
    }
}
