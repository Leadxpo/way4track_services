import { ClientStatusEnum } from "../enum/client-status.enum";

export class ClientSearchDto {
    branchName?: ClientStatusEnum;
    clientId?: string
    phoneNumber?: string
    fromDate?: Date;
    toDate?: Date;
    name?: string
    userName?: string
    companyCode?: string;
    unitCode?: string
}