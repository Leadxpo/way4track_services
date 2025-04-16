import { ClientStatus } from "../enum/client-status.enum";
export declare class ClientDto {
    id?: number;
    name: string;
    branch: number;
    phoneNumber: string;
    dob: string;
    email: string;
    address: string;
    joiningDate: Date;
    clientPhoto?: string;
    clientId?: string;
    voucherId?: number;
    companyCode: string;
    unitCode: string;
    hsnCode: string;
    SACCode: string;
    tds: boolean;
    tcs: boolean;
    billWiseDate: boolean;
    status: ClientStatus;
    branchName?: string;
}
