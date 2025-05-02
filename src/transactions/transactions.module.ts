import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "./entity/transactions.entity";
import { TransactionService } from "./transaction.service";
import { TransactionAdapter } from "./transaction.adapter";
import { TransactionRepository } from "./repo/transactions-repo";
import { TransactionController } from "./transaction.controller";



@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity])],
    providers: [TransactionService, TransactionAdapter, TransactionRepository],
    controllers: [TransactionController],
    exports: [TransactionRepository, TransactionService]
})
export class TransactionssModule { }
