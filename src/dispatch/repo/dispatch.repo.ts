import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DispatchEntity } from "../entity/dispatch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";



@Injectable()

export class DispatchRepository extends Repository<DispatchEntity> {

    constructor(private dataSource: DataSource) {
        super(DispatchEntity, dataSource.createEntityManager());
    }

    async getDispatchData(req: {
        fromDate?: string;
        toDate?: string;
        transportId?: string;
        companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.createQueryBuilder('de')
            .select([
                'de.id',
                'sf.name AS staffName',
                'sb.name AS subDealerName',
                'cl.name AS clientName',
                'de.from_address as fromAddress',
                'de.to_address as toAddress',
                'de.dispatch_date as dispatchDate',
                'de.arrival_date as arrivalDate',
                'de.status as status',
                'de.transport_id as transportId',
                'de.package_id as packageId',
                'de.tracking_url as trackingURL',
                'de.dispatch_company_name as dispatchCompanyName',

            ])
            .leftJoin(ClientEntity, 'cl', 'de.client_id = cl.id')
            .leftJoin(StaffEntity, 'sf', 'de.staff_id = sf.id')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = de.sub_dealer_id');
        query.andWhere('de.company_code = :companyCode', { companyCode: req.companyCode });
        query.andWhere('de.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.fromDate && req.toDate) {
            query.andWhere('de.dispatch_date BETWEEN :fromDate AND :toDate', {
                fromDate: req.fromDate,
                toDate: req.toDate,
            });
        }
        if (req.transportId) {
            query.andWhere('de.transport_id = :transportId', { transportId: req.transportId });
        }

        const result = await query.getRawMany();
        return result;
    }

}