import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AccountEntity } from "../entity/account.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { VoucherTypeEnum } from "src/voucher/enum/voucher-type-enum";
import { AccountIdDto } from "../dto/account.id.dto";
import { PaymentType } from "src/asserts/enum/payment-type.enum";



@Injectable()

export class AccountRepository extends Repository<AccountEntity> {

    constructor(private dataSource: DataSource) {
        super(AccountEntity, dataSource.createEntityManager());
    }

    async getAccountBySearch(req: {
        accountName?: string; accountNumber?: string; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ac')
            .where(`ac.company_code = "${req.companyCode}"`)
            .andWhere(`ac.unit_code = "${req.unitCode}"`)
        if (req.accountName) {
            query.andWhere('ac.account_name = :accountName', { accountName: req.accountName });
        }

        if (req.accountNumber) {
            query.andWhere('ac.account_number = :accountNumber', { accountNumber: req.accountNumber });
        }
        const result = await query.getRawMany();
        return result;
    }

}