import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { RequestType } from "../entity/request-raise.entity";

export class RequestRaiseDto {
    id?: number;
    requestType: RequestType;
    // staffID: number;
    requestTo: number;
    requestFrom: number;
    branch: number;
    description: string;
    createdDate: Date;
    status: ClientStatusEnum
    subDealerId: number
    companyCode: string;
    unitCode: string;
    requestId?: string
    products?: RequestTypeProducts[];
}
export class RequestTypeProducts {
    productType: string;
    quantity: number;

}