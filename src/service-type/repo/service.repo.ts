import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ServiceTypeEntity } from "../entity/service.entity";




@Injectable()

export class ServiceTypeRepository extends Repository<ServiceTypeEntity> {

    constructor(private dataSource: DataSource) {
        super(ServiceTypeEntity, dataSource.createEntityManager());
    }

   
}