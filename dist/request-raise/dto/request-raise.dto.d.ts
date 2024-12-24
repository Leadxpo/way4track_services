import { ClientStatusEnum } from "src/client/enum/client-status.enum";
export declare class RequestRaiseDto {
    id?: number;
    requestType: string;
    staffID: number;
    branchId: number;
    description: string;
    createdDate: Date;
    status: ClientStatusEnum;
    clientID: number;
    companyCode: string;
    unitCode: string;
    requestId?: string;
}
