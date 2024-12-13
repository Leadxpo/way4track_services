import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { EstimateEntity } from "../entity/estimate.entity";



@Injectable()

export class EstimateRepository extends Repository<EstimateEntity> {

    constructor(private dataSource: DataSource) {
        super(EstimateEntity, dataSource.createEntityManager());
    }
}