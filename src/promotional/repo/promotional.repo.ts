import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PromotionEntity } from "../entity/promotional-entity";




@Injectable()

export class PromotionRepository extends Repository<PromotionEntity> {

    constructor(private dataSource: DataSource) {
        super(PromotionEntity, dataSource.createEntityManager());
    }


}