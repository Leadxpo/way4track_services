import { ClientStatusEnum } from "../enum/client-status.enum";

export class ClientDto {
    id?: number;
    name: string;
    branchId: number;
    phoneNumber: string;
    dob: string;
    email: string;
    address: string;
    joiningDate: string;
    clientPhoto?: string;
    clientId?: string;
    voucherId?: number
    companyCode: string;
    unitCode: string
}
