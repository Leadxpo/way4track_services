import { CreatePromotionDto } from "./dto/promotional.dto";
import { PromotionEntity } from "./entity/promotional-entity";

export class PromotionAdapter {
    fromDtoToEntity(dto: CreatePromotionDto): PromotionEntity {
        const entity = new PromotionEntity();
        Object.assign(entity, dto);
        return entity;
    }

    fromEntityToDto(entity: PromotionEntity): CreatePromotionDto {
        const dto = new CreatePromotionDto();
        Object.assign(dto, entity);
        return dto;
    }

    fromEntityListToDtoList(entities: PromotionEntity[]): CreatePromotionDto[] {
        return entities.map(entity => this.fromEntityToDto(entity));
    }
}
