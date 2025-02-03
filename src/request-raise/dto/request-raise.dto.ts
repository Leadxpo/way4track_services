import { ClientStatusEnum } from "src/client/enum/client-status.enum";

export class RequestRaiseDto {
    id?: number;
    requestType: string;
    // staffID: number;
    requestTo: number;
    requestFrom: number;
    branchId: number;
    description: string;
    createdDate: Date;
    status: ClientStatusEnum
    subDealerId: number
    companyCode: string;
    unitCode: string;
    requestId?: string
}
