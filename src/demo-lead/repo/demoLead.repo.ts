import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DemoLeadEntity } from "../entity/demoLead.entity";

@Injectable()

export class DemoLeadRepository extends Repository<DemoLeadEntity> {

    constructor(private dataSource: DataSource) {
        super(DemoLeadEntity, dataSource.createEntityManager());
    }
}