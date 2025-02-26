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
    status: DispatchStatus;
    transportId?: string;
    packageId?: string;
    assignedProductsId?: number;
    receiverName?: string;
    dispatcherName?: string;
    trackingURL?: string;
    staffId?: string;
    staffName?: string;

    clientId?: string;
    clientName?: string;

    subDealerId?: string;
    subDealerName?: string;

    constructor(
        id: number,
        companyCode?: string,
        unitCode?: string,
        fromAddress?: string,
        toAddress?: string,
        dispatchCompanyName?: string,
        dispatchDate?: Date,
        arrivalDate?: Date,
        status: DispatchStatus = DispatchStatus.DISPATCHED,
        transportId?: string,
        packageId?: string,
        assignedProductsId?: number,
        receiverName?: string,
        dispatcherName?: string,
        trackingURL?: string,
        staffId?: string,
        staffName?: string,
        clientId?: string,
        clientName?: string,
        subDealerId?: string,
        subDealerName?: string
    ) {
        this.id = id;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.dispatchCompanyName = dispatchCompanyName;
        this.dispatchDate = dispatchDate ? dispatchDate.toISOString() : undefined;
        this.arrivalDate = arrivalDate ? arrivalDate.toISOString() : undefined;
        this.status = status;
        this.transportId = transportId;
        this.packageId = packageId;
        this.assignedProductsId = assignedProductsId;
        this.receiverName = receiverName;
        this.dispatcherName = dispatcherName;
        this.trackingURL = trackingURL;
        this.staffId = staffId;
        this.staffName = staffName
        this.clientId = clientId;
        this.clientName = clientName
        this.subDealerId = subDealerId;
        this.subDealerName = subDealerName
    }
}
