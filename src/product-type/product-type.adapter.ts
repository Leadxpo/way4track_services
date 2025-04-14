import { ProductTypeDto } from "./dto/product-type.dto";
import { ProductTypeResponseDto } from "./dto/product-type.res.dto";
import { ProductTypeEntity } from "./entity/product-type.entity";

export class ProductTypeAdapter {
    convertEntityToDto(
        entity: ProductTypeEntity | ProductTypeEntity[]
    ): ProductTypeResponseDto | ProductTypeResponseDto[] {
        if (Array.isArray(entity)) {
            return entity.map(
                (item) =>
                    new ProductTypeResponseDto(
                        item.id,
                        item.name,
                        item.companyCode,
                        item.unitCode,
                        item.type
                        // item.productPhoto,
                        // item.blogImage,
                        // item.description
                    )
            );
        }

        return new ProductTypeResponseDto(
            entity.id,
            entity.name,
            entity.companyCode,
            entity.unitCode,
            entity.type

            // entity.productPhoto,
            // entity.productPhoto,
            // entity.description

        );
    }

    convertDtoToEntity(dto: ProductTypeDto): ProductTypeEntity {
        const entity = new ProductTypeEntity();

        if (dto.id) {
            entity.id = dto.id;
        }
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.name = dto.name;
        entity.type = dto.type
        // entity.productPhoto = dto.productPhoto;
        // entity.blogImage = dto.blogImage
        // entity.description = dto.description
        return entity;
    }
}