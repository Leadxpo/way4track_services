import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
export declare enum AppointmentType {
    SERVICE = "service",
    PRODUCT = "product"
}
export declare enum AppointmentStatus {
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    SENT = "sent"
}
export declare class AppointmentEntity {
    id: number;
    appointmentId: string;
    appointmentType: AppointmentType;
    name: string;
    slot: Date;
    description: string;
    status: AppointmentStatus;
    staffId: StaffEntity;
    clientId: ClientEntity;
    branchId: BranchEntity;
    companyCode: string;
    unitCode: string;
}
