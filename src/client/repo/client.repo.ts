import { Injectable } from "@nestjs/common";
import { ClientEntity } from "../entity/client.entity";
import { DataSource, Repository } from "typeorm";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientDetailDto } from "../dto/detail.client.dto";



@Injectable()

export class ClientRepository extends Repository<ClientEntity> {

    constructor(private dataSource: DataSource) {
        super(ClientEntity, dataSource.createEntityManager());
    }
    async getClientData() {
        const query = await this.createQueryBuilder('cl')
            .select([
                'cl.client_id AS clientId',
                'cl.phone_number AS phoneNumber',
                'cl.name AS name',
                'cl.joining_date AS joiningDate',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id as voucherId',
            ])
            .leftJoin(VoucherEntity, 'vr', 'vr.id = cl.voucher_id')
            .getRawMany();
        return query;
    }

    async getDetailClientData(req: ClientDetailDto) {
        console.log(req, "++++++++++++++++++++++")
        const query = await this.createQueryBuilder('cl')
            .select([
                'cl.client_id AS clientId',
                'cl.phone_number AS phoneNumber',
                'cl.name AS name',
                'cl.joining_date AS joiningDate',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id AS voucherId',
                'br.name AS branchName',
                'cl.email AS email',
                'cl.dob AS dob',
                'cl.address AS address',
                'vr.name AS voucherName',
                'vr.generation_date AS generationDate',
                'vr.product_type AS productType',
            ])
            .leftJoin(VoucherEntity, 'vr', 'vr.id = cl.voucher_id')
            .leftJoin(BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.client_id='${req.clientId}'`)
            .groupBy(`vr.voucher_id `)
            .getRawOne();
        console.log(query, "++++++++++++++++++++++++++++++")

        return query;
    }
}