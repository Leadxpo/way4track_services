import { InstallationEnum } from "../enum/installation.enum";

export class WorkAllocationResDto {
    id: number;
    workAllocationNumber: string;
    serviceOrProduct: string;
    otherInformation: string;
    date: Date;
    clientId: number;
    clientName: string;
    clientAddress: string;
    clientPhoneNumber: string;
    staffId: number;
    assignedTo: string; // Staff name
    companyCode?: string;
    unitCode?: string;
    productId?: number;
    productName?: string;
    dateOfPurchase?: Date;
    vendorId?: number;
    imeiNumber?: string;
    categoryName?: string;
    price?: number;
    productDescription?: string;
    vendorPhoneNumber?: string;
    vendorName?: string;
    vendorAddress?: string;
    vendorEmailId?: string;
    install?: InstallationEnum
    voucherId?: string
    voucherName?: string
    constructor(
        id: number,
        workAllocationNumber: string,
        serviceOrProduct: string,
        otherInformation: string,
        date: Date,
        clientId: number,
        clientName: string,
        clientAddress: string,
        clientPhoneNumber: string,
        staffId: number,
        assignedTo: string,
        companyCode?: string,
        unitCode?: string,
        productId?: number,
        productName?: string,
        dateOfPurchase?: Date,
        vendorId?: number,
        imeiNumber?: string,
        categoryName?: string,
        price?: number,
        productDescription?: string,
        vendorPhoneNumber?: string,
        vendorName?: string,
        vendorAddress?: string,
        vendorEmailId?: string,
        install?: InstallationEnum,
        voucherId?: string,
        voucherName?: string

    ) {
        this.id = id;
        this.workAllocationNumber = workAllocationNumber;
        this.serviceOrProduct = serviceOrProduct;
        this.otherInformation = otherInformation;
        this.date = date;
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientAddress = clientAddress;
        this.clientPhoneNumber = clientPhoneNumber;
        this.staffId = staffId;
        this.assignedTo = assignedTo;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.productId = productId;
        this.productName = productName;
        this.dateOfPurchase = dateOfPurchase;
        this.vendorId = vendorId;
        this.imeiNumber = imeiNumber;
        this.categoryName = categoryName;
        this.price = price;
        this.productDescription = productDescription;
        this.vendorPhoneNumber = vendorPhoneNumber;
        this.vendorName = vendorName;
        this.vendorAddress = vendorAddress;
        this.vendorEmailId = vendorEmailId;
        this.install = install
        this.voucherId = voucherId
        this.voucherName = this.voucherName
    }
}
