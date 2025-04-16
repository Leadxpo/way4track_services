import { AppointmentStatus, AppointmentType, TimePeriodEnum } from "../entity/appointement.entity";
export declare class AppointmentResDto {
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
    period: TimePeriodEnum;
    description: string;
    status: AppointmentStatus;
    appointmentId: string;
    companyCode: string;
    unitCode: string;
    voucherId?: string;
    constructor(id: number, name: string, clientPhoneNumber: string, clientId: string, clientAddress: string, clientName: string, branchId: number, branchName: string, appointmentType: AppointmentType, staffId: number, assignedTo: string, date: string, slot: string, period: TimePeriodEnum, description: string, status: AppointmentStatus, appointmentId: string, companyCode: string, unitCode: string, voucherId?: string);
}
