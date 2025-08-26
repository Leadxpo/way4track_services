import { AppointmentStatus, AppointmentType, CallType, Service, TimePeriodEnum } from "../entity/appointement.entity";

export class AppointmentResDto {
    id: number;
    name: string;
    clientPhoneNumber: string;
    clientId: string;
    clientAddress: string;
    clientName: string;
    branchId: number;
    branchName: string;
    appointmentType: AppointmentType;
    staffId: number;
    assignedTo: string;
    createdBy: number;
    date: string;
    slot: string;
    period: TimePeriodEnum
    description: string;
    status: AppointmentStatus;
    callType:CallType;
    service?:Service;
    appointmentId: string;
    companyCode: string;
    unitCode: string
    voucherId?: string
    image: string[]

    constructor(
        id: number,
        name: string,
        clientPhoneNumber: string,
        clientId: string,
        clientAddress: string,
        clientName: string,
        branchId: number,
        branchName: string,
        appointmentType: AppointmentType,
        staffId: number,
        createdBy: number,
        assignedTo: string,
        date: string,
        slot: string,
        period: TimePeriodEnum,
        description: string,
        status: AppointmentStatus,
        callType: CallType,
        service:Service,
        appointmentId: string,
        companyCode: string,
        unitCode: string,
        voucherId?: string,
        image?: string[]

    ) {
        this.id = id;
        this.name = name;
        this.clientPhoneNumber = clientPhoneNumber;
        this.clientId = clientId;
        this.clientAddress = clientAddress;
        this.clientName = clientName;
        this.branchId = branchId;
        this.branchName = branchName;
        this.appointmentType = appointmentType;
        this.staffId = staffId;
        this.createdBy = createdBy;
        this.assignedTo = assignedTo;
        this.date = date;
        this.slot = slot;
        this.period = period;
        this.description = description;
        this.status = status;
        this.callType = callType;
        this.service = service;
        this.appointmentId = appointmentId;
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.voucherId = voucherId
        this.image = image
    }
}
