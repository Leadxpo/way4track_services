import { Injectable } from '@nestjs/common';
import { DemoLeadEntity } from './entity/demoLead.entity';
import { DemoLeadDto } from './dto/demoLead.dto';
import { DemoLeadResDto } from './dto/demoLead-res';

@Injectable()
export class DemoLeadAdapter {
    convertDtoToEntity(dto: DemoLeadDto): DemoLeadEntity {
        const entity = new DemoLeadEntity();
        entity.clientName = dto.clientName;
        entity.clientPhoneNumber = dto.clientPhoneNumber;
        entity.clientEmail = dto.clientEmail;
        entity.clientAddress = dto.clientAddress;
        entity.demoLeadType = dto.demoLeadType;
        entity.date = dto.date
        entity.slot = dto.slot;
        entity.period = dto.period;
        entity.status = dto.status;
        entity.description = dto.description;
        entity.demoLeadId = dto.demoLeadId;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        return entity;
    }

    convertEntityToDto(entities: DemoLeadEntity[]): DemoLeadResDto[] {
        return entities.map((entity) => {
            const formattedDate = new Date(entity.date).toLocaleDateString('en-GB');
            const formattedTime = entity.slot.substring(0, 5);
            return new DemoLeadResDto(
                entity.id,
                entity.clientName,
                entity.clientPhoneNumber || '',
                entity.clientEmail || '',
                entity.clientAddress || '',
                entity.demoLeadType,
                formattedDate,
                formattedTime,
                entity.period,
                entity.description,
                entity.status,
                entity.demoLeadId,
                entity.companyCode,
                entity.unitCode
            );
        });
    }
}
