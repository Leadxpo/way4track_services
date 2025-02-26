import { DispatchStatus } from '../entity/dispatch.entity';

export class DispatchDto {
    id?: number;
    companyCode?: string;
    unitCode?: string;
    fromAddress?: string;
    toAddress?: string;
    dispatchCompanyName?: string;
    dispatchDate?: Date;
    arrivalDate?: Date;
    status: DispatchStatus;
    transportId?: string;
    packageId?: string;
    assignedProductsId?: number;
    receiverName?: string;
    dispatcherName?: string;
    trackingURL?: string;
    staffId?: string;
    clientId?: string;
    subDealerId?: string;
}
