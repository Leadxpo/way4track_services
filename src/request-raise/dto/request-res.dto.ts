import { ClientStatusEnum } from "src/client/enum/client-status.enum";

export class RequestResDto {
    id: number;
    requestType: string;
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
    constructor(
        id: number,
        requestType: string,
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
        subDealerName?: string
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
    }
}
