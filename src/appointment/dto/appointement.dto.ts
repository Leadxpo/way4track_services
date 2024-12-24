import { AppointmentStatus, AppointmentType } from "../entity/appointement.entity";

export class AppointmentDto {
  id?: number;
  appointmentId?: string;
  appointmentType: AppointmentType;
  name: string;
  assignedToId: number; 
  slot: Date;
  branchId: number; 
  clientId: number; 
  description?: string;
  status?: AppointmentStatus;
  companyCode: string;
  unitCode: string
}
