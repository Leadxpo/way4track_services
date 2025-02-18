import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";

export class TechnicianWorksResponseDto {
    id: number;
    service: string;
    workStatus: WorkStatusEnum;
    paymentStatus: PaymentStatus;
    imeiNumber: string;
    vehicleType: string;
    vehicleNumber: string;
    chassisNumber: string;
    engineNumber: string;
    vehiclePhoto?: string;
    date: Date;
    staffId: number;
    branchId: number;
    productId: number;
    vendorId: number;
    clientId: number;
    voucherId: number;
    workId: number;
    companyCode: string;
    unitCode: string;
    productName: string;
    name: string;
    phoneNumber: string;
    simNumber: string;
    address: string;

    constructor(
        id: number,
        service: string,
        workStatus: WorkStatusEnum,
        paymentStatus: PaymentStatus,
        imeiNumber: string,
        vehicleType: string,
        vehicleNumber: string,
        chassisNumber: string,
        engineNumber: string,
        vehiclePhoto?: string,
        date?: Date,
        staffId?: number,
        branchId?: number,
        productId?: number,
        vendorId?: number,
        clientId?: number,
        voucherId?: number,
        workId?: number,
        companyCode?: string,
        unitCode?: string,
        productName?: string,
        name?: string,
        phoneNumber?: string,
        simNumber?: string,
        address?: string
    ) {
        this.id = id;
        this.service = service;
        this.workStatus = workStatus;
        this.paymentStatus = paymentStatus;
        this.imeiNumber = imeiNumber;
        this.vehicleType = vehicleType;
        this.vehicleNumber = vehicleNumber;
        this.chassisNumber = chassisNumber;
        this.engineNumber = engineNumber;
        this.vehiclePhoto = vehiclePhoto;
        this.date = date ?? new Date();
        this.staffId = staffId ?? null;
        this.branchId = branchId ?? null;
        this.productId = productId ?? null;
        this.vendorId = vendorId ?? null;
        this.clientId = clientId ?? null;
        this.voucherId = voucherId ?? null;
        this.workId = workId ?? null;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.productName = productName ?? "";
        this.name = name ?? "";
        this.phoneNumber = phoneNumber ?? "";
        this.simNumber = simNumber ?? "";
        this.address = address ?? "";
    }
}
