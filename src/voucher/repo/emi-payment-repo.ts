import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { EmiPaymentEntity } from "../entity/emi-payments";

@Injectable()

export class EmiPaymentRepository extends Repository<EmiPaymentEntity> {

    constructor(private dataSource: DataSource) {
        super(EmiPaymentEntity, dataSource.createEntityManager());
    }
}