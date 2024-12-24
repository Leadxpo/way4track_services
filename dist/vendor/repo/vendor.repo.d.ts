import { DataSource, Repository } from "typeorm";
import { VendorEntity } from "../entity/vendor.entity";
import { VendorDetail } from "../dto/vendor-id.deatil";
export declare class VendorRepository extends Repository<VendorEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getVendorData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getDetailvendorData(req: VendorDetail): Promise<any>;
}
