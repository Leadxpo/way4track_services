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
    transUpdateUser?: string;
    transDate?: Date;
    deliveredUpdateUser?: string;
    deliveredDate?: Date;
    status: DispatchStatus;
    transportId?: string;
    packageId?: string;
    receiverName?: string;
    dispatcherName?: string;
    trackingURL?: string;
    staffId?: string;
    subDealerId?: string;
    deliveryDescription?: string;
    dispatchDescription?: string;
    dispatchBoximage: string[];

}
