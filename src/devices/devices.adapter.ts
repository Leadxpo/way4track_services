
import { WebsiteProductEntity } from 'src/website-product/entity/website-entity';
import { DeviceDto } from './dto/devices.dto';
import { DeviceEntity } from './entity/devices-entity';

export class DeviceAdapter {
    static convertDtoToEntity(dto: DeviceDto): DeviceEntity {
        const entity = new DeviceEntity();
        entity.id = dto.id;
        entity.webProduct = new WebsiteProductEntity();
        entity.webProduct.id = dto.webProductId;
        entity.webProductName = dto.webProductName;
        entity.image = dto.image;
        entity.model = dto.model;
        return entity;
    }

    static convertEntityToDto(entities: DeviceEntity[]): DeviceDto[] {
        return entities.map((entity) => ({
            id: entity.id,
            webProductId: entity.webProduct?.id,
            webProductName: entity.webProductName,
            image: entity.image,
            model: entity.model,
        }));
    }
}