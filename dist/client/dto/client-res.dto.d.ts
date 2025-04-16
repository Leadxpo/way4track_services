import { ClientStatus } from "../enum/client-status.enum";
export declare class ClientResDto {
    id: number;
    name: string;
    phoneNumber: string;
    clientId: string;
    clientPhoto: string;
    branchId: number;
    branchName: string;
    email: string;
    address: string;
    joiningDate: Date;
    companyCode: string;
    unitCode: string;
    status: ClientStatus;
    constructor(id: number, name: string, phoneNumber: string, clientId: string, clientPhoto: string, branchId: number, branchName: string, email: string, address: string, joiningDate: Date, companyCode: string, unitCode: string, status: ClientStatus);
}
