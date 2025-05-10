import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RefundEntity } from "../entity/refund.entity";




@Injectable()

export class RefundRepository extends Repository<RefundEntity> {

    constructor(private dataSource: DataSource) {
        super(RefundEntity, dataSource.createEntityManager());
    }


}