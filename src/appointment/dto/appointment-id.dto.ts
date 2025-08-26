import { CallType, Service } from "../entity/appointement.entity";

export class AppointmentIdDto {
    service?:Service;
    id: number;
    callType?: CallType;
    companyCode: string;
    unitCode: string
}