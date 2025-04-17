import { AmenitiesDto } from './dto/amenities.dto';
import { AmenitiesEntity } from './entity/amenities-entity';

export class AmenitiesAdapter {
    convertDtoToEntity(dto: AmenitiesDto): AmenitiesEntity {
        const entity = new AmenitiesEntity();
        entity.id = dto.id;
        entity.webProduct = dto.webProductId ? { id: dto.webProductId } as any : null;
        entity.webProductName = dto.webProductName;
        entity.image = dto.image;
        entity.name = dto.name;
        entity.desc = dto.desc;
        return entity;
    }

    convertEntityToDto(entity: AmenitiesEntity): AmenitiesDto {
        return {
            id: entity.id,
            webProductId: entity.webProduct?.id,
            webProductName: entity.webProductName,
            image: entity.image,
            name: entity.name,
            desc: entity.desc,
        };
    }

    convertEntityListToDto(entities: AmenitiesEntity[]): AmenitiesDto[] {
        return entities.map(e => this.convertEntityToDto(e));
    }
}
