import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TermsAndConditionEntity } from "../entity/t&c.entity";



@Injectable()

export class TermsAndConditionRepository extends Repository<TermsAndConditionEntity> {

    constructor(private dataSource: DataSource) {
        super(TermsAndConditionEntity, dataSource.createEntityManager());
    }
}