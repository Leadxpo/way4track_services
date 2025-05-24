import { Injectable } from '@nestjs/common';
import { PromocodeDto } from './dto/promo.dto';
import { PromoEntity,DiscountTypeEnum,promoStatusEnum} from './entity/promo.entity';
import { GetPromoResDto } from './dto/get-promo-res.dto';

@Injectable()
export class PromocodeAdapter {
    
    convertDtoToEntity(dto: PromocodeDto): PromoEntity {
        const entity = new PromoEntity();
        
        if (dto.id) {
            entity.id = dto.id;
        }

        entity.promocode = dto.promocode;
        entity.date = dto.date || new Date();
        entity.discount = dto.discount;
        entity.discountType = dto.discountType || DiscountTypeEnum.Amount;
        entity.minSaleAmount = dto.minSaleAmount;
        entity.maxDiscountAmount = dto.maxDiscountAmount;
        entity.promoUsers = dto.promoUsers;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;

        return entity;
    }

    convertEntityToDto(entities: PromoEntity[]): GetPromoResDto[] {
        return entities.map((entity) => {
            return new GetPromoResDto(
                entity.id,
                entity.promocode,
                entity.date,
                entity.discount,
                entity.discountType,
                entity.minSaleAmount ? entity.minSaleAmount : undefined,
                entity.maxDiscountAmount ? entity.maxDiscountAmount : undefined,
                entity.promoUsers,
                entity.companyCode,
                entity.unitCode,
                entity.createdAt,
                entity.updatedAt
            );
        });
    }
}
