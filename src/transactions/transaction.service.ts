import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { ErrorResponse } from 'src/models/error-response';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepository } from './repo/transactions-repo';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionAdapter } from './transaction.adapter';
import { TransactionEntity } from './entity/transactions.entity';
@Injectable()
export class TransactionService {
    constructor(
        private readonly transactionRepo: TransactionRepository,
        private readonly adapter: TransactionAdapter,
    ) { }

    async handleCreateTransaction(dto: CreateTransactionDto): Promise<CommonResponse> {
        try {
            let entity: TransactionEntity;
            if (dto.id) {
                entity = await this.transactionRepo.findOne({ where: { id: dto.id } });
                if (!entity) return new CommonResponse(false, 404, 'Transaction not found');
                Object.assign(entity, this.adapter.toEntity(dto));
                await this.transactionRepo.save(entity);
                return new CommonResponse(true, 200, 'Transaction updated');
            } else {
                entity = this.adapter.toEntity(dto);
                await this.transactionRepo.save(entity);
                return new CommonResponse(true, 201, 'Transaction created');
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteTransaction(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.transactionRepo.findOne({ where: { id: dto.id } });
            if (!existing) return new CommonResponse(false, 404, 'Transaction not found');
            await this.transactionRepo.delete({ id: dto.id });
            return new CommonResponse(true, 200, 'Transaction deleted');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getTransactionList(): Promise<CommonResponse> {
        try {
            const data = await this.transactionRepo.find({ relations: ['order', 'client'] });
            return new CommonResponse(true, 200, 'Transaction list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getTransactionById(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const entity = await this.transactionRepo.findOne({ where: { id: dto.id }, relations: ['order', 'client'] });
            if (!entity) return new CommonResponse(false, 404, 'Transaction not found');
            return new CommonResponse(true, 200, 'Transaction fetched', this.adapter.toResponseDto(entity));
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
