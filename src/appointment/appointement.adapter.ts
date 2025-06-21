import { Injectable } from '@nestjs/common';
import { AppointmentEntity } from './entity/appointement.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { AppointmentDto } from './dto/appointement.dto';
import { AppointmentResDto } from './dto/appointment-res.sto';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';


@Injectable()
export class AppointmentAdapter {
    convertDtoToEntity(dto: AppointmentDto): AppointmentEntity {
        const entity = new AppointmentEntity();
        entity.appointmentType = dto.appointmentType;
        entity.name = dto.name;
        entity.date = dto.date
        entity.slot = dto.slot;
        entity.period = dto.period;
        entity.status = dto.status;
        entity.description = dto.description;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        const staff = new StaffEntity();
        staff.id = dto.assignedTo;
        entity.staffId = staff;
        if (dto.voucherId) {
            const voucher = new VoucherEntity();
            voucher.id = dto.voucherId;
            entity.voucherId = voucher;
        } else {
            entity.voucherId = null;
        }


        const branch = new BranchEntity();
        branch.id = dto.branchId;
        entity.branchId = branch;

        const client = new ClientEntity();
        client.id = dto.clientId;
        entity.clientId = client;
        entity.appointmentId = dto.appointmentId;

        return entity;
    }

    convertEntityToDto(entities: AppointmentEntity[]): AppointmentResDto[] {
        return entities.map((entity) => {
            const formattedDate = new Date(entity.date).toLocaleDateString('en-GB');
            const formattedTime = entity.slot.substring(0, 5);
            return new AppointmentResDto(
                entity.id,
                entity.name,
                entity.clientId?.phoneNumber || '',
                entity.clientId?.clientId || null,
                entity.clientId?.address || '',
                entity.clientId?.name || '',
                entity.branchId?.id || 0,
                entity.branchId?.branchName || '',
                entity.appointmentType,
                entity.staffId?.id || 0,
                entity.staffId?.name || '',
                formattedDate,
                formattedTime,
                entity.period,
                entity.description,
                entity.status,
                entity.appointmentId,
                entity.companyCode,
                entity.unitCode,
                entity.voucherId ? entity.voucherId.voucherId : ''
            );
        });
    }




}
