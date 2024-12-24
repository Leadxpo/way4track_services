import { DataSource, Repository } from "typeorm";
import { SubDealerEntity } from "../entity/sub-dealer.entity";
import { DetailSubDealerDto } from "../dto/detail-sub-dealer.dto";
import { LoginDto } from "src/login/dto/login.dto";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
export declare class SubDealerRepository extends Repository<SubDealerEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getSubDealerData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: PaymentStatus;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any[]>;
    getDetailSubDealerData(req: DetailSubDealerDto): Promise<any>;
    SubDealerLoginDetails(req: LoginDto): Promise<any>;
}
