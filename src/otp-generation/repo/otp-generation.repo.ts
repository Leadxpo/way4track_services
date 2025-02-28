import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OtpEntity } from "../entity/otp-generation.entity";



@Injectable()

export class OTPRepository extends Repository<OtpEntity> {

    constructor(private dataSource: DataSource) {
        super(OtpEntity, dataSource.createEntityManager());
    }
}