import { AppointmentStatus, AppointmentType } from "../entity/appointement.entity";

export class AppointmentResDto {
    id: number;
    name: string;
    clientPhoneNumber: string;
    clientId: number;
    clientAddress: string;
    clientName: string;
    branchId: number;
    branchName: string;
    appointmentType: AppointmentType;
    staffId: number;
    assignedTo: string; // Staff name
    slot: Date;
    description: string;
    status: AppointmentStatus;
    appointmentId: string

    constructor(
        id: number,
        name: string,
        clientPhoneNumber: string,
        clientId: number,
        clientAddress: string,
        clientName: string,
        branchId: number,
        branchName: string,
        appointmentType: AppointmentType,
        staffId: number,
        assignedTo: string,
        slot: Date,
        description: string,
        status: AppointmentStatus,
        appointmentId: string
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
        this.slot = slot;
        this.description = description;
        this.status = status;
        this.appointmentId = appointmentId;
    }
}
