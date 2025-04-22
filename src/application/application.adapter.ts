import { ApplicationDto } from "./dto/application.dto";
import { ApplicationEntity } from "./entity/application-entity";


export class ApplicationAdapter {
    convertDtoToEntity(dto: ApplicationDto): ApplicationEntity {
        const entity = new ApplicationEntity();
        entity.id = dto.id;
        entity.webProduct = dto.webProductId ? { id: dto.webProductId } as any : null;
        entity.webProductName = dto.webProductName;
        entity.image = dto.image;
        entity.name = dto.name;
        entity.desc = dto.desc;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        return entity;
    }

    convertEntityToDto(entity: ApplicationEntity): ApplicationDto {
        return {
            id: entity.id,
            webProductId: entity.webProduct?.id,
            webProductName: entity.webProductName,
            image: entity.image,
            name: entity.name,
            desc: entity.desc,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode
        };
    }

    convertEntityListToDto(entities: ApplicationEntity[]): ApplicationDto[] {
        return entities.map(e => this.convertEntityToDto(e));
    }
}
