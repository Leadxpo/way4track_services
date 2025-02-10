import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { HiringEntity } from "../entity/hiring.entity";



@Injectable()

export class HiringRepository extends Repository<HiringEntity> {

    constructor(private dataSource: DataSource) {
        super(HiringEntity, dataSource.createEntityManager());
    }

   
}