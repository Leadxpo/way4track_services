import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { Remarks, Requirements } from "./technician-works.dto";
import { emit } from "process";

export class TechnicianWorksResponseDto {
    id: number;
    service: string;
    workStatus: WorkStatusEnum;
    paymentStatus: PaymentStatus;
    imeiNumber: string;
    vehicleType: string;
    vehicleNumber: string;
    description: string;

    chassisNumber: string;
    engineNumber: string;
    vehiclePhoto1?: string;
    vehiclePhoto2?: string;
    vehiclePhoto3?: string;
    vehiclePhoto4?: string;
    vehiclePhoto5?: string;
    vehiclePhoto6?: string;
    vehiclePhoto7?: string;
    vehiclePhoto8?: string;
    vehiclePhoto9?: string;
    vehiclePhoto10?: string;

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

    screenShot?: string
    supportId?: number
    supportName?: string
    serviceOrProduct?: string;
    technicianNumber?: string
    email?: string;
    startDate?: Date;
    endDate?: Date;
    vehicleId?: number
    serviceId?: number
    installationAddress?: string
    remark?: Remarks[];
    acceptStartDate?: Date;
    activateDate?: Date;
    pendingDate?: Date;
    completedDate?: Date;
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
        description: string,
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
        address?: string,
        vehiclePhoto1?: string,
        vehiclePhoto2?: string,
        vehiclePhoto3?: string,
        vehiclePhoto4?: string,
        vehiclePhoto5?: string,
        vehiclePhoto6?: string,
        vehiclePhoto7?: string,
        vehiclePhoto8?: string,
        vehiclePhoto9?: string,
        vehiclePhoto10?: string,
        screenShot?: string,
        startDate?: Date,
        endDate?: Date,
        supportId?: number,
        supportName?: string,
        serviceOrProduct?: string,
        technicianNumber?: string,
        email?: string,
        vehicleId?: number,
        serviceId?: number,
        installationAddress?: string,
        remark?: Remarks[],
        acceptStartDate?: Date,
        activateDate?: Date,
        pendingDate?: Date,
        completedDate?: Date


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
        this.description = description
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
        this.vehiclePhoto1 = vehiclePhoto1 ?? "";
        this.vehiclePhoto2 = vehiclePhoto2 ?? "";
        this.vehiclePhoto3 = vehiclePhoto3 ?? "";
        this.vehiclePhoto4 = vehiclePhoto4 ?? "";
        this.vehiclePhoto5 = vehiclePhoto5 ?? "";
        this.vehiclePhoto6 = vehiclePhoto6 ?? "";
        this.vehiclePhoto7 = vehiclePhoto7 ?? "";
        this.vehiclePhoto8 = vehiclePhoto8 ?? "";
        this.vehiclePhoto9 = vehiclePhoto9 ?? "";
        this.vehiclePhoto10 = vehiclePhoto10 ?? "";
        this.screenShot = screenShot
        this.supportId = supportId
        this.supportName = supportName
        this.serviceOrProduct = serviceOrProduct
        this.technicianNumber = technicianNumber
        this.email = email
        this.startDate = startDate
        this.endDate = endDate
        this.remark = remark
        this.vehicleId = vehicleId
        this.serviceId = serviceId
        this.installationAddress = installationAddress
        this.acceptStartDate = acceptStartDate
        this.activateDate = activateDate
        this.pendingDate = pendingDate
        this.completedDate = completedDate


    }
}
