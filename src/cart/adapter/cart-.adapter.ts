// adapter/cart.adapter.ts

import { CartEntity } from '../entity/cart.entity';
import { CartResponseDto, CreateCartDto } from '../dto/cart.dto';

export class CartAdapter {
    toEntity(dto: CreateCartDto): CartEntity {
        const entity = new CartEntity();

        if (dto.id) {
            entity.id = dto.id;
        }

        entity.name = dto.name;
        entity.quantity = dto.quantity;
        entity.isRelay = dto.isRelay;
        entity.network = dto.network;
        entity.pincode = dto.pincode;
        entity.subscription = dto.subscription;
        entity.totalAmount = dto.totalAmount;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.client = dto.clientId ? { id: dto.clientId } as any : null;
        entity.device = dto.deviceId ? { id: dto.deviceId } as any : null;

        return entity;
    }



    toResponse(entity: CartEntity): CartResponseDto {
        return {
            id: entity.id,
            name: entity.name,
            quantity: entity.quantity,
            isRelay: entity.isRelay,
            network: entity.network,
            pincode: entity.pincode,
            subscription: entity.subscription,
            totalAmount: entity.totalAmount,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            clientId: entity.client?.id,
            deviceId: entity.device?.id,
        }
    };
}

