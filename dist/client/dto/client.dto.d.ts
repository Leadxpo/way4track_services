import { ClientStatusEnum } from "../enum/client-status.enum";
export declare class ClientDto {
    id: number;
    name: string;
    branchId: number;
    phoneNumber: string;
    dob: Date;
    email: string;
    address: string;
    status: ClientStatusEnum;
    joiningDate: Date;
    amount: number;
    clientPhoto?: string;
    voucherId?: number;
    companyCode: string;
    unitCode: string;
}
