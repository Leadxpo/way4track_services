import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { RequestType } from "../entity/request-raise.entity";
import { RequestTypeProducts } from "./request-raise.dto";
export declare class RequestResDto {
    id: number;
    requestType: RequestType;
    staffID: string;
    requestBY: string;
    requestTo: string;
    description: string;
    createdDate: Date;
    branchId: number;
    branchName: string;
    status: ClientStatusEnum;
    companyCode: string;
    unitCode: string;
    subDealerId?: number;
    subDealerName?: string;
    products?: RequestTypeProducts[];
    requestFor: string;
    fromDate?: Date;
    toDate?: Date;
    constructor(id: number, requestType: RequestType, staffID: string, requestBY: string, requestTo: string, description: string, createdDate: Date, branchId: number, branchName: string, status: ClientStatusEnum, companyCode: string, unitCode: string, subDealerId?: number, subDealerName?: string, products?: RequestTypeProducts[], requestFor?: string, fromDate?: Date, toDate?: Date);
}
