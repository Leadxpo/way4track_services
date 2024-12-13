import { Injectable } from '@nestjs/common';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateEntity } from './entity/estimate.entity';
import { ClientEntity } from 'src/client/entity/client.entity';

@Injectable()
export class EstimateAdapter {
    convertDtoToEntity(dto: EstimateDto): EstimateEntity {
        const entity = new EstimateEntity();
        entity.id = dto.id;
        entity.buildingAddress = dto.buildingAddress;
        entity.estimateDate = dto.estimateDate;
        entity.expireDate = dto.expireDate;
        entity.productOrService = dto.productOrService;
        entity.description = dto.description;
        entity.amount = dto.totalAmount;
        entity.products = dto.products;
        const clientEntity = new ClientEntity();
        clientEntity.clientId = dto.clientId;
        entity.clientId = clientEntity;

        return entity;
    }

    convertEntityToResDto(entity: EstimateEntity): EstimateResDto {
        const dto = new EstimateResDto(
            entity.id,
            entity.clientId.clientId,
            entity.clientId.name,
            entity.clientId.address,
            entity.clientId.email,
            entity.clientId.phoneNumber,
            entity.buildingAddress,
            entity.estimateDate,
            entity.expireDate,
            entity.productOrService,
            entity.description,
            entity.amount,
            entity.products
        );
        return dto;
    }
}
