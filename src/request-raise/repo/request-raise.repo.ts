import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RequestRaiseEntity } from "../entity/request-raise.entity";



@Injectable()

export class RequestRaiseRepository extends Repository<RequestRaiseEntity> {

    constructor(private dataSource: DataSource) {
        super(RequestRaiseEntity, dataSource.createEntityManager());
    }
}