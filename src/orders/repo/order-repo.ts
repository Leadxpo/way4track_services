import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OrderEntity } from "../entity/orders.entity";
@Injectable()

export class OrderRepository extends Repository<OrderEntity> {

    constructor(private dataSource: DataSource) {
        super(OrderEntity, dataSource.createEntityManager());
    }


}