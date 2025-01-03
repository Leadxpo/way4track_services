import { Injectable } from "@nestjs/common";
import { ClientEntity } from "../entity/client.entity";
import { DataSource, Repository } from "typeorm";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ClientDetailDto } from "../dto/detail.client.dto";
import { ClientSearchDto } from "../dto/client-search.dto";
import { CommonReq } from "src/models/common-req";



@Injectable()

export class ClientRepository extends Repository<ClientEntity> {

    constructor(private dataSource: DataSource) {
        super(ClientEntity, dataSource.createEntityManager());
    }
    async getClientData(req: CommonReq) {
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
            .where(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
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
                'cl.status AS status',
                'cl.address AS address',
                'vr.name AS voucherName',
                'vr.generation_date AS generationDate',
                'vr.product_type AS productType',
            ])
            .leftJoin(VoucherEntity, 'vr', 'vr.id = cl.voucher_id')
            .leftJoin(BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.client_id='${req.clientId}'`)
            .andWhere(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
            .groupBy(`vr.voucher_id `)
            .getRawOne();
        console.log(query, "++++++++++++++++++++++++++++++")

        return query;
    }

    async getSearchDetailClient(req: ClientSearchDto) {
        const query = this.createQueryBuilder('cl')
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
                'cl.status AS status',
                'vr.name AS voucherName',
                'vr.generation_date AS generationDate',
                'vr.product_type AS productType',
            ])
            .leftJoin(VoucherEntity, 'vr', 'vr.id = cl.voucher_id')
            .leftJoin(BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
        if (req.clientId) {
            query.andWhere('cl.client_id = :clientId', { clientId: req.clientId });
        }
        if (req.name) {
            query.andWhere('cl.name LIKE :name', { name: `%${req.name}%` });
        }
        if (req.status) {
            query.andWhere('cl.status = :status', { status: req.status });
        }

        const result = await query.groupBy('vr.voucher_id').getRawMany();

        console.log(result, "++++++++++++++++++++++++++++++");
        return result;
    }

}