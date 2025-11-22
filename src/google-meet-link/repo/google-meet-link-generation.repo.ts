import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { GoogleMeetLinkEntity } from "../entity/google-meet-link-generation.entity";



@Injectable()

export class GoogleMeetLinkRepository extends Repository<GoogleMeetLinkEntity> {

    constructor(private dataSource: DataSource) {
        super(GoogleMeetLinkEntity, dataSource.createEntityManager());
    }
}