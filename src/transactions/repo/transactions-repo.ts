import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TransactionEntity } from "../entity/transactions.entity";
@Injectable()

export class TransactionRepository extends Repository<TransactionEntity> {

    constructor(private dataSource: DataSource) {
        super(TransactionEntity, dataSource.createEntityManager());
    }


}