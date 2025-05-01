import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AddressEntity } from "../entity/address.entity";





@Injectable()

export class AddressRepository extends Repository<AddressEntity> {

    constructor(private dataSource: DataSource) {
        super(AddressEntity, dataSource.createEntityManager());
    }


}