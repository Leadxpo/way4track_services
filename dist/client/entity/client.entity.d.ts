import { BaseEntity } from 'typeorm';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';
import { ClientStatusEnum } from '../enum/client-status.enum';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
export declare class ClientEntity extends BaseEntity {
    id: number;
    name: string;
    phoneNumber: string;
    clientId: string;
    request: RequestRaiseEntity[];
    status: ClientStatusEnum;
    dob: Date;
    email: string;
    address: string;
    joiningDate: Date;
    branch: BranchEntity;
    voucherId: VoucherEntity;
    appiontment: AppointmentEntity[];
    estimate: EstimateEntity[];
    workAllocation: WorkAllocationEntity[];
    clientPhoto: string;
    companyCode: string;
    unitCode: string;
}
