import { AppointmentStatus, AppointmentType, CallType, Service, TimePeriodEnum } from "../entity/appointement.entity";

export class AppointmentDto {
  id?: number;
  appointmentId?: string;
  appointmentType: AppointmentType;
  name: string;
  assignedTo: number;
  createdBy: number;
  date: string;
  slot: string;
  period: TimePeriodEnum;
  branchId: number;
  clientId: number;
  description?: string;
  status?: AppointmentStatus;
  service?:Service;
  callType: CallType;
  companyCode: string;
  unitCode: string;
  voucherId?:number;
  image: string[];
}
