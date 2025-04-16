import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DeviceEntity } from "../entity/devices-entity";




@Injectable()

export class DeviceRepository extends Repository<DeviceEntity> {

    constructor(private dataSource: DataSource) {
        super(DeviceEntity, dataSource.createEntityManager());
    }


}