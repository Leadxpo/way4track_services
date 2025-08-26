import { ClientStatus, ClientStatusEnum } from "../enum/client-status.enum";

export class ClientDto {
    id?: number;
    name: string;
    branch: number;
    phoneNumber: string;
    dob: string;
    email: string;
    address: string;
    state: string;
    clientPhoto?: string;
    clientId?: string;
    userName?: string;
    voucherId?: number
    companyCode: string;
    unitCode: string
    hsnCode: string;
    SACCode: string;
    tds: boolean;
    tcs: boolean;
    status: ClientStatus
    branchName?: string;
    GSTNumber?: string;
    createdBy?: number;
}
