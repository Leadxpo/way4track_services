import { ClientEntity } from 'src/client/entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BaseEntity } from 'typeorm';
export declare class WorkAllocationEntity extends BaseEntity {
    id: number;
    workAllocationNumber: string;
    serviceOrProduct: string;
    otherInformation: string;
    date: Date;
    staffId: StaffEntity;
    clientId: ClientEntity;
    companyCode: string;
    unitCode: string;
}
