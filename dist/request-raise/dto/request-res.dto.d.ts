import { ClientStatusEnum } from "src/client/enum/client-status.enum";
export declare class RequestResDto {
    id: number;
    requestType: string;
    staffID: number;
    requestBY: string;
    requestTo: string;
    description: string;
    createdDate: Date;
    branchId: number;
    branchName: string;
    status: ClientStatusEnum;
    companyCode: string;
    unitCode: string;
    constructor(id: number, requestType: string, staffID: number, requestBY: string, requestTo: string, description: string, createdDate: Date, branchId: number, branchName: string, status: ClientStatusEnum, companyCode: string, unitCode: string);
}
