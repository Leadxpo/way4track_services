import { ClientStatusEnum } from "../enum/client-status.enum";

export class ClientSearchDto {
    status: ClientStatusEnum;
    clientId: string
    name: string
    companyCode: string;
    unitCode: string
}