import { AppointmentStatus, AppointmentType, TimePeriodEnum } from "../entity/appointement.entity";

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
    date: string;
    slot: string;
    period: TimePeriodEnum
    description: string;
    status: AppointmentStatus;
    appointmentId: string;
    companyCode: string;
    unitCode: string
    voucherId?: string


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
        assignedTo: string,
        date: string,
        slot: string,
        period: TimePeriodEnum,
        description: string,
        status: AppointmentStatus,
        appointmentId: string,
        companyCode: string,
        unitCode: string,
  voucherId?: string

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
        this.assignedTo = assignedTo;
        this.date = date;
        this.slot = slot;
        this.period = period;
        this.description = description;
        this.status = status;
        this.appointmentId = appointmentId;
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.voucherId=voucherId
    }
}
