import { DataSource, Repository } from "typeorm";
import { ProductEntity } from "../entity/product.entity";
import { ProductIdDto } from "../dto/product.id.dto";
import { CommonReq } from "src/models/common-req";
export declare class ProductRepository extends Repository<ProductEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getSearchDetailProduct(req: ProductIdDto): Promise<any[]>;
    getDetailProduct(req: CommonReq): Promise<any>;
    productAssignDetails(req: {
        branchName?: string;
        subDealerId?: string;
        staffId?: string;
        companyCode?: string;
        unitCode?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<any>;
}
