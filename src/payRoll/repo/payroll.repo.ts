import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PayrollEntity } from "../entity/pay-roll.entity";



@Injectable()

export class PayrollRepository extends Repository<PayrollEntity> {

    constructor(private dataSource: DataSource) {
        super(PayrollEntity, dataSource.createEntityManager());
    }


}