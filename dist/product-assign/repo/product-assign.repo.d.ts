import { DataSource, Repository } from "typeorm";
import { ProductAssignEntity } from "../entity/product-assign.entity";
import { CommonReq } from "src/models/common-req";
export declare class ProductAssignRepository extends Repository<ProductAssignEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    productAssignDetails(req: CommonReq): Promise<any>;
    totalProducts(req: CommonReq): Promise<any>;
    getTotalAssignedAndStockLast30Days(req: CommonReq): Promise<any>;
    getAssignedQtyLast30Days(req: CommonReq): Promise<any[]>;
}
