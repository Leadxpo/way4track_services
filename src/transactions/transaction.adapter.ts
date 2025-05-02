// adapter/transaction.adapter.ts

import { CreateTransactionDto, TransactionResponseDto } from "./dto/create-transaction.dto";
import { TransactionEntity } from "./entity/transactions.entity";


export class TransactionAdapter {
    toEntity(dto: CreateTransactionDto): TransactionEntity {
        const entity = new TransactionEntity();
        entity.transactionId = dto.transactionId;
        entity.totalAmount = dto.totalAmount;
        entity.paymentMethod = dto.paymentMethod;
        entity.paymentStatus = dto.paymentStatus;
        entity.deliveryAddress = dto.deliveryAddress;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.client = { id: dto.clientId } as any;
        entity.order = { id: dto.orderId } as any;
        if (dto.id) entity.id = dto.id;
        return entity;
    }

    toResponseDto(entity: TransactionEntity): TransactionResponseDto {
        return {
            id: entity.id,
            transactionId: entity.transactionId,
            totalAmount: entity.totalAmount,
            paymentMethod: entity.paymentMethod,
            paymentStatus: entity.paymentStatus,
            deliveryAddress: entity.deliveryAddress,
            clientId: entity.client?.id,
            orderId: entity.order?.id,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
