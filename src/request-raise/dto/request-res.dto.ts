import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { RequestType } from "../entity/request-raise.entity";
import { RequestTypeProducts } from "./request-raise.dto";

export class RequestResDto {
    id: number;
    requestType: RequestType;
    staffID: string;
    requestBY: string;
    requestTo: string;
    description: string;
    createdDate: Date;
    branchId: number;
    branchName: string;
    status: ClientStatusEnum
    companyCode: string;
    unitCode: string
    subDealerId?: number
    subDealerName?: string
    products?: RequestTypeProducts[];
    requestFor: string;
    fromDate?: Date;
    toDate?: Date;

    constructor(
        id: number,
        requestType: RequestType,
        staffID: string,

        requestBY: string,
        requestTo: string,
        description: string,
        createdDate: Date,
        branchId: number,
        branchName: string,
        status: ClientStatusEnum,
        companyCode: string,
        unitCode: string,
        subDealerId?: number,
        subDealerName?: string,
        products?: RequestTypeProducts[],
        requestFor?: string,
        fromDate?: Date,
        toDate?: Date

    ) {
        this.id = id;
        this.requestType = requestType;
        this.staffID = staffID;
        this.requestBY = requestBY;
        this.requestTo = requestTo;
        this.description = description;
        this.createdDate = createdDate;
        this.branchId = branchId;
        this.branchName = branchName;
        this.status = status
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.subDealerId = subDealerId
        this.subDealerName = subDealerName
        this.products = products
        this.requestFor = requestFor
        this.fromDate = fromDate
        this.toDate = toDate

    }
}
