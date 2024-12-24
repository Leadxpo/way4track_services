import { AppointmentStatus, AppointmentType } from "../entity/appointement.entity";
export declare class AppointmentResDto {
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
    assignedTo: string;
    slot: Date;
    description: string;
    status: AppointmentStatus;
    appointmentId: string;
    companyCode: string;
    unitCode: string;
    constructor(id: number, name: string, clientPhoneNumber: string, clientId: number, clientAddress: string, clientName: string, branchId: number, branchName: string, appointmentType: AppointmentType, staffId: number, assignedTo: string, slot: Date, description: string, status: AppointmentStatus, appointmentId: string, companyCode: string, unitCode: string);
}
