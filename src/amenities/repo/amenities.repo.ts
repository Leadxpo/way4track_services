import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AmenitiesEntity } from "../entity/amenities-entity";




@Injectable()

export class AmenitiesRepository extends Repository<AmenitiesEntity> {

    constructor(private dataSource: DataSource) {
        super(AmenitiesEntity, dataSource.createEntityManager());
    }


}