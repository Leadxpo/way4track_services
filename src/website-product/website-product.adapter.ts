import { WebsiteProductDto } from "./dto/website.dto";
import { WebsiteProductEntity } from "./entity/website-entity";

export class WebsiteProductAdapter {
    convertDtoToEntity(dto: WebsiteProductDto): WebsiteProductEntity {
        const entity = new WebsiteProductEntity();
        Object.assign(entity, dto);
        return entity;
    }

    convertEntityToDto(entities: WebsiteProductEntity[]): WebsiteProductDto[] {
        return entities.map(entity => ({ ...entity }));
    }
}