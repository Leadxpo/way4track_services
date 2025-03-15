import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { LedgerEntity } from "../entity/ledger.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { VoucherIDResDTo } from "src/voucher/dto/voucher-id.res.dto";

@Injectable()

export class LedgerRepository extends Repository<LedgerEntity> {

    constructor(private dataSource: DataSource) {
        super(LedgerEntity, dataSource.createEntityManager());
    }
    async getLedgerDataTable(req: {
        group?: string;
        ledgerName?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('le')
            .select([
                '`le`.`group` as `ledgerGroup`',  // Renamed alias to avoid conflict
                'le.name as ledgerName',
                'le.state as state',
                'le.country as country',
                'le.pan_number as panNumber',
                'le.id as id',
                'le.registration_type as registrationType',
                'le.gst_uin_number as gstUinNumber',
            ])
            .where('le.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('le.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.ledgerName) {
            query.andWhere('le.name = :ledgerName', { ledgerName: req.ledgerName });
        }
        if (req.group) {
            query.andWhere('le.group = :group', { group: req.group });
        }

        // Consider removing groupBy unless necessary
        // query.groupBy('le.group');

        const result = await query.getRawMany();
        return result;
    }


}