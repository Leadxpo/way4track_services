import { ClientStatusEnum } from "../enum/client-status.enum";
export declare class ClientSearchDto {
    branchName?: ClientStatusEnum;
    clientId?: string;
    name?: string;
    companyCode?: string;
    unitCode?: string;
}
