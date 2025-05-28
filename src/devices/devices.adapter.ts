import { WebsiteProductEntity } from 'src/website-product/entity/website-entity';
import { DeviceDto } from './dto/devices.dto';
import { DeviceEntity } from './entity/devices-entity';

export class DeviceAdapter {
    convertDtoToEntity(dto: DeviceDto): DeviceEntity {
        const entity = new DeviceEntity();

        entity.id = dto.id;
        entity.webProduct = new WebsiteProductEntity();
        entity.webProduct.id = dto.webProductId;
        entity.webProductName = dto.webProductName;
        entity.image = dto.image;
        entity.model = dto.model;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.amount = dto.amount
        // ✅ New fields
        entity.name = dto.name;
        entity.state = dto.state;
        entity.city = dto.city;
        entity.isRelay = dto.isRelay;
        entity.relayAmt = dto.relayAmt;
        entity.isSubscription = dto.isSubscription;
        entity.subscriptionMonthlyAmt = dto.subscriptionMonthlyAmt;
        entity.subscriptionYearlyAmt = dto.subscriptionYearlyAmt;
        entity.isNetwork = dto.isNetwork;
        entity.discount = dto.discount;
        entity.description = dto.description;

        return entity;
    }

    convertEntityToDto(entities: DeviceEntity[]): DeviceDto[] {
        return entities.map((entity) => ({
            id: entity.id,
            webProductId: entity.webProduct?.id,
            webProductName: entity.webProductName,
            image: entity.image,
            model: entity.model,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,

            // ✅ New fields
            name: entity.name,
            state: entity.state,
            city: entity.city,
            isRelay: entity.isRelay,
            relayAmt: entity.relayAmt,
            isSubscription: entity.isSubscription,
            subscriptionMonthlyAmt: entity.subscriptionMonthlyAmt,
            subscriptionYearlyAmt: entity.subscriptionYearlyAmt,
            isNetwork: entity.isNetwork,
            discount: entity.discount,
            description: entity.description,
            amount: entity.amount
        }));
    }
}
