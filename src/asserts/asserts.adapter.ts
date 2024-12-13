import { Injectable } from '@nestjs/common';
import { AssertsDto } from './dto/asserts.dto';
import { AssertsEntity } from './entity/asserts-entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';

@Injectable()
export class AssertsAdapter {
    convertEntityToDto(entity: AssertsEntity): AssertsDto {
        return {
            id: entity.id,
            assertsName: entity.assertsName,
            assertsAmount: entity.assertsAmount,
            quantity: entity.quantity,
            branchId: entity.branchId?.id,
            description: entity.description,
            purchaseDate: entity.purchaseDate,
            voucherId: entity.voucherId?.voucherId,
            initialPayment: entity.initialPayment,
            numberOfEmi: entity.numberOfEmi,
            emiAmount: entity.emiAmount,
            paymentType: entity.paymentType,
            assetType: entity.assetType,
            assetPhoto: entity.assetPhoto
        };
    }

    convertAssertsDtoToEntity(dto: AssertsDto): AssertsEntity {
        const entity = new AssertsEntity();
        entity.id = dto.id;
        entity.assertsName = dto.assertsName;
        entity.assertsAmount = dto.assertsAmount;
        entity.quantity = dto.quantity;
        entity.branchId = { id: dto.branchId } as any;
        entity.description = dto.description;
        entity.purchaseDate = dto.purchaseDate;
        entity.voucherId = { id: dto.voucherId } as any;
        entity.initialPayment = dto.initialPayment;
        entity.numberOfEmi = dto.numberOfEmi;
        entity.emiAmount = dto.emiAmount;
        entity.assetPhoto = dto.assetPhoto
        return entity;
    }
}
