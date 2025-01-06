import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { NotificationEntity } from "../entity/notification.entity";


@Injectable()

export class NotificationRepository extends Repository<NotificationEntity> {

    constructor(private dataSource: DataSource) {
        super(NotificationEntity, dataSource.createEntityManager());
    }
}