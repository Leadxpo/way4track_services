import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SalesWorksEntity } from "../entity/sales-man.entity";



@Injectable()

export class SalesworkRepository extends Repository<SalesWorksEntity> {

    constructor(private dataSource: DataSource) {
        super(SalesWorksEntity, dataSource.createEntityManager());
    }

   
}