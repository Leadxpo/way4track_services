import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { VehicleTypeEntity } from "../entity/vehicle-type.entity";




@Injectable()

export class VehicleTypeRepository extends Repository<VehicleTypeEntity> {

    constructor(private dataSource: DataSource) {
        super(VehicleTypeEntity, dataSource.createEntityManager());
    }


}