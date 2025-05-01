import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CartEntity } from "../entity/cart.entity";





@Injectable()

export class CartRepository extends Repository<CartEntity> {

    constructor(private dataSource: DataSource) {
        super(CartEntity, dataSource.createEntityManager());
    }


}