import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TicketsEntity } from "../entity/tickets.entity";



@Injectable()

export class TicketsRepository extends Repository<TicketsEntity> {

    constructor(private dataSource: DataSource) {
        super(TicketsEntity, dataSource.createEntityManager());
    }

    async totalTickets(): Promise<any> {
        const query = this.createQueryBuilder('tc')
            .select([
                'count(tc.ticket_number) AS totalTickets',
            ]);
        const monthResult = await query.andWhere(`DATE(tc.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()`)
            .getRawOne();
        const weekResult = await query.andWhere(`DATE(tc.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()`)
            .getRawOne();
        const last30DaysTickets = monthResult.totalTickets;
        const last7DaysTickets = weekResult.totalTickets;
        let percentageChange = 0;
        if (last7DaysTickets && last30DaysTickets) {
            percentageChange = ((last30DaysTickets - last7DaysTickets) / last7DaysTickets) * 100;
        }

        return {
            last30DaysTickets: last30DaysTickets,
            percentageChange: percentageChange.toFixed(2), 
    }


}
}