import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { RequestType } from "../entity/request-raise.entity";
export declare class RequestRaiseDto {
    id?: number;
    requestType: RequestType;
    requestTo: number;
    requestFrom: number;
    branch: number;
    description: string;
    requestFor: string;
    createdDate: Date;
    status: ClientStatusEnum;
    subDealerId: number;
    companyCode: string;
    unitCode: string;
    requestId?: string;
    products?: RequestTypeProducts[];
    fromDate?: Date;
    toDate?: Date;
}
export declare class RequestTypeProducts {
    productType: string;
    quantity: number;
}
