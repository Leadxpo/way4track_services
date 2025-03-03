import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DesignationEntity } from "../entity/designation.entity";
import { CreateDesignationDto } from "../dto/designation.dto";



@Injectable()

export class DesignationRepository extends Repository<DesignationEntity> {
  
    constructor(private dataSource: DataSource) {
        super(DesignationEntity, dataSource.createEntityManager());
    }

   
}