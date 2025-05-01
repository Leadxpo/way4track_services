import { CreateAddressDto } from "./dto/create-address.dto";
import { AddressEntity } from "./entity/address.entity";

export class AddressAdapter {
    toEntity(dto: CreateAddressDto): AddressEntity {
        const entity = new AddressEntity();

        if (dto.id) entity.id = dto.id;
        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        entity.country = dto.country;
        entity.state = dto.state;
        entity.city = dto.city;
        entity.pincode = dto.pincode;
        entity.addressLineOne = dto.addressLineOne;
        entity.addressLineTwo = dto.addressLineTwo;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.client = dto.clientId ? { id: dto.clientId } as any : null;

        return entity;
    }

    toResponse(entity: AddressEntity): any {
        return {
            id: entity.id,
            name: entity.name,
            phoneNumber: entity.phoneNumber,
            country: entity.country,
            state: entity.state,
            city: entity.city,
            pincode: entity.pincode,
            addressLineOne: entity.addressLineOne,
            addressLineTwo: entity.addressLineTwo,
            clientId: entity.client?.id,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
