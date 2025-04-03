import { VehicleTypeDto } from "./dto/vehicle-type.dto";
import { VehicleTypeResponseDto } from "./dto/vehicle-type.res";
import { VehicleTypeEntity } from "./entity/vehicle-type.entity";


export class VehicleTypeAdapter {
    convertEntityToDto(
        entity: VehicleTypeEntity | VehicleTypeEntity[]
    ): VehicleTypeResponseDto | VehicleTypeResponseDto[] {
        if (Array.isArray(entity)) {
            return entity.map(
                (item) =>
                    new VehicleTypeResponseDto(
                        item.id,
                        item.name,
                        item.companyCode,
                        item.unitCode,
                        item.description,
                    )
            );
        }

        return new VehicleTypeResponseDto(
            entity.id,
            entity.name,
            entity.companyCode,
            entity.unitCode,
            entity.description,
        );
    }

    convertDtoToEntity(dto: VehicleTypeDto): VehicleTypeEntity {
        const entity = new VehicleTypeEntity();

        if (dto.id) {
            entity.id = dto.id;
        }
        entity.name = dto.name!;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.description = dto.description ?? "";

        return entity;
    }
}
