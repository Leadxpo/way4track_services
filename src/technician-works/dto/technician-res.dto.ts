import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";
import { Requirements } from "./technician-works.dto";
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
    // requirementDetails?: Requirements[];
    attendedDate?: Date;
    screenShot?: string
    supportId?: number
    supportName?: string
    serviceOrProduct?: string;
    technicianNumber?: string
    email?: string;

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
        address?: string,
        vehiclePhoto1?: string,
        vehiclePhoto2?: string,
        vehiclePhoto3?: string,
        vehiclePhoto4?: string,
        // requirementDetails?: Requirements[],
        attendedDate?: Date,
        screenShot?: string,
        supportId?: number,
        supportName?: string,
        serviceOrProduct?: string,
        technicianNumber?: string,
        email?: string


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
        this.vehiclePhoto1 = vehiclePhoto1 ?? "";
        this.vehiclePhoto2 = vehiclePhoto2 ?? "";
        this.vehiclePhoto3 = vehiclePhoto3 ?? "";
        this.vehiclePhoto4 = vehiclePhoto4 ?? "";
        // this.requirementDetails = requirementDetails;
        this.attendedDate = attendedDate;
        this.screenShot = screenShot
        this.supportId = supportId
        this.supportName = supportName
        this.serviceOrProduct = serviceOrProduct
        this.technicianNumber = technicianNumber
        this.email = email
    }
}
