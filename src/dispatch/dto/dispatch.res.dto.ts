import { DispatchStatus } from '../entity/dispatch.entity';

export class DispatchResponseDto {
    id: number;
    companyCode?: string;
    unitCode?: string;
    fromAddress?: string;
    toAddress?: string;
    dispatchCompanyName?: string;
    dispatchDate?: string; // Formatted as ISO string
    arrivalDate?: string;
    transUpdateUser?: string;
    transDate?: string;
    deliveredUpdateUser?: string;
    deliveredDate?: string;
    status: DispatchStatus;
    transportId?: string;
    packageId?: string;
    receiverName?: string;
    dispatcherName?: string;
    trackingURL?: string;
    staffId?: string;
    staffName?: string;
    subDealerId?: string;
    subDealerName?: string;
    deliveryDescription?: string;
    dispatchDescription?: string;
    dispatchBoximage?: string[];

    constructor(
        id: number,
        companyCode?: string,
        unitCode?: string,
        fromAddress?: string,
        toAddress?: string,
        dispatchCompanyName?: string,
        dispatchDate?: Date,
        arrivalDate?: Date,
        transUpdateUser?: string,
        transDate?: Date,
        deliveredUpdateUser?: string,
        deliveredDate?: Date,    
        status: DispatchStatus = DispatchStatus.DISPATCHED,
        transportId?: string,
        packageId?: string,
        receiverName?: string,
        dispatcherName?: string,
        trackingURL?: string,
        staffId?: string,
        staffName?: string,
        subDealerId?: string,
        subDealerName?: string,
        deliveryDescription?:string,
        dispatchDescription?:string,
        dispatchBoximage?: string[]
    ) {
        this.id = id;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.dispatchCompanyName = dispatchCompanyName;
        this.dispatchDate = dispatchDate ? dispatchDate.toISOString() : undefined;
        this.arrivalDate = arrivalDate ? arrivalDate.toISOString() : undefined;
        this.transUpdateUser = transUpdateUser;
        this.transDate = transDate ? transDate.toISOString() : undefined;
        this.deliveredUpdateUser = deliveredUpdateUser;
        this.deliveredDate = deliveredDate ? deliveredDate.toISOString() : undefined;
        this.status = status;
        this.transportId = transportId;
        this.packageId = packageId;
        this.receiverName = receiverName;
        this.dispatcherName = dispatcherName;
        this.trackingURL = trackingURL;
        this.staffId = staffId;
        this.staffName = staffName
        this.subDealerId = subDealerId;
        this.subDealerName = subDealerName
        this.deliveryDescription= deliveryDescription;
        this.dispatchDescription= dispatchDescription;
        this.dispatchBoximage = dispatchBoximage
    }
}
