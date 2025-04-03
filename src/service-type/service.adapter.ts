import { ServiceTypeDto } from "./dto/service.dto";
import { ServiceTypeResponseDto } from "./dto/service.res.dto";
import { ServiceTypeEntity } from "./entity/service.entity";

export class ServiceTypeAdapter {
    convertEntityToDto(
        entity: ServiceTypeEntity | ServiceTypeEntity[]
    ): ServiceTypeResponseDto | ServiceTypeResponseDto[] {
        if (Array.isArray(entity)) {
            return entity.map(
                (item) =>
                    new ServiceTypeResponseDto(
                        item.id,
                        item.name,
                        item.duration,
                        item.companyCode,
                        item.unitCode,
                        item.description,
                    )
            );
        }

        return new ServiceTypeResponseDto(
            entity.id,
            entity.name,
            entity.duration,
            entity.companyCode,
            entity.unitCode,
            entity.description,
        );
    }

    convertDtoToEntity(dto: ServiceTypeDto): ServiceTypeEntity {
        const entity = new ServiceTypeEntity();

        if (dto.id) {
            entity.id = dto.id;
        }
        entity.name = dto.name!;
        entity.duration = dto.duration!;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.description = dto.description ?? "";

        return entity;
    }
}
