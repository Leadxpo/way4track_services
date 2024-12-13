import { AppointmentStatus, AppointmentType } from "../entity/appointement.entity";

export class AppointmentDto {
  id?: number;
  appointmentId?: string;
  appointmentType: AppointmentType;
  name: string;
  assignedToId: number; // Staff ID
  slot: Date;
  branchId: number; // Branch ID
  clientId: number; // Client ID
  description?: string;
  status?: AppointmentStatus;
}
