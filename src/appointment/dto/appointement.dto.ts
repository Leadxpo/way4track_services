import { AppointmentStatus, AppointmentType, TimePeriodEnum } from "../entity/appointement.entity";

export class AppointmentDto {
  id?: number;
  appointmentId?: string;
  appointmentType: AppointmentType;
  name: string;
  assignedToId: number;
  date: string
  slot: string;
  period: TimePeriodEnum;
  branchId: number;
  clientId: string;
  description?: string;
  status?: AppointmentStatus;
  companyCode: string;
  unitCode: string
}
