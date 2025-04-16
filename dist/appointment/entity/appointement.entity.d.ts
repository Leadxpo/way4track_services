import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
export declare enum AppointmentType {
    SERVICE = "service",
    PRODUCT = "product"
}
export declare enum AppointmentStatus {
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    SENT = "sent"
}
export declare enum TimePeriodEnum {
    AM = "AM",
    PM = "PM"
}
export declare class AppointmentEntity {
    id: number;
    appointmentId: string;
    appointmentType: AppointmentType;
    name: string;
    date: string | null;
    createdAt: Date;
    updatedAt: Date;
    slot: string;
    period: TimePeriodEnum;
    description: string;
    status: AppointmentStatus;
    staffId: StaffEntity;
    clientId: ClientEntity;
    voucherId: VoucherEntity;
    branchId: BranchEntity;
    companyCode: string;
    unitCode: string;
}
