import { ProductAppDto } from './dto/product-app.dto';
import { WebsiteProductEntity } from 'src/website-product/entity/website-entity';
import { ProductAppEntity } from './entity/product-app.entity';

export class ProductAppAdapter {
     toEntity(dto: ProductAppDto): ProductAppEntity {
        const entity = new ProductAppEntity();
        entity.id = dto.id;
        entity.name = dto.name;
        entity.image = dto.image;
        entity.shortDescription = dto.shortDescription;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.orderItems = dto.orderItems;

        if (dto.webProductId) {
            const product = new WebsiteProductEntity();
            product.id = dto.webProductId;
            entity.webProduct = product;
        }

        return entity;
    }

     toDto(entity: ProductAppEntity): ProductAppDto {
        return {
            id: entity.id,
            name: entity.name,
            image: entity.image,
            shortDescription: entity.shortDescription,
            webProductId: entity.webProduct?.id,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            orderItems: entity.orderItems,
        };
    }
}
