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

    entity.demoLeadType = dto.demoLeadType;
    entity.description = dto.description;
    entity.status = dto.status || entity.status;

    entity.selectedProducts = dto.selectedProducts || [];
    entity.totalProductsSelected = dto.totalProductsSelected || 0;

    entity.demoLeadId = dto.demoLeadId;

    entity.companyCode = dto.companyCode;
    entity.unitCode = dto.unitCode;

    return entity;
  }

  convertEntityToDto(entities: DemoLeadEntity[]): DemoLeadResDto[] {
    return entities.map((entity) => {
      return new DemoLeadResDto(
        entity.id,
        entity.clientName,
        entity.clientPhoneNumber,
        entity.clientEmail,
        entity.demoLeadType,
        entity.selectedProducts,
        entity.totalProductsSelected,
        entity.description,
        entity.status,
        entity.demoLeadId,
        entity.companyCode,
        entity.unitCode
      );
    });
  }
}
