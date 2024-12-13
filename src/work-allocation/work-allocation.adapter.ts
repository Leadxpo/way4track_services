import { Injectable } from '@nestjs/common';
import { WorkAllocationEntity } from './entity/work-allocation.entity';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationResDto } from './dto/work-allocation-res.dto';
import { ClientEntity } from 'src/client/entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';

@Injectable()
export class WorkAllocationAdapter {
    convertDtoToEntity(dto: WorkAllocationDto): WorkAllocationEntity {
        const entity = new WorkAllocationEntity();
        if (dto.id) entity.id = dto.id;

        const client = new ClientEntity()
        client.id = dto.clientId
        entity.clientId = client

        const staff = new StaffEntity()
        staff.id = dto.staffId
        entity.staffId = staff
        entity.serviceOrProduct = dto.serviceOrProduct;
        entity.otherInformation = dto.otherInformation;
        entity.date = dto.date;

        return entity;
    }

    convertEntityToDto(entities: WorkAllocationEntity[]): WorkAllocationResDto[] {
        return entities.map((entity) => {
            const client = entity.clientId
            const staff = entity.staffId;

            return new WorkAllocationResDto(
                entity.id,
                entity.workAllocationNumber,
                entity.serviceOrProduct,
                entity.otherInformation,
                entity.date,
                client?.id || 0,
                client?.name || '',
                client?.address || '',
                client?.phoneNumber || '',
                staff?.id || 0,
                entity?.staffId?.name || '',
            );
        });
    }

}