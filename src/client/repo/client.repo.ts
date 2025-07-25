import { Injectable } from "@nestjs/common";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { CommonReq } from "src/models/common-req";
import { DataSource, Repository } from "typeorm";
import { ClientSearchDto } from "../dto/client-search.dto";
import { ClientDetailDto } from "../dto/detail.client.dto";
import { ClientEntity } from "../entity/client.entity";



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
                'cl.state AS state',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id as voucherId',
                'cl.status as status'

            ])
            .leftJoin('cl.voucherId', 'vr')
            .where(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
            .getRawMany();
        return query;
    }

    async getDetailClientData(req: ClientDetailDto) {
        const query = await this.createQueryBuilder('cl')
            .select([
                'cl.client_id AS clientId',
                'cl.user_name AS userName',
                'cl.phone_number AS phoneNumber',
                'cl.name AS name',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id AS voucherId',
                'vr.quantity as quantity',
                'br.name AS branchName',
                'cl.email AS email',
                'cl.address AS address',
                'cl.state AS state',
                'vr.name AS voucherName',
                'vr.generation_date AS generationDate',
                'vr.product_type AS productType',
                'cl.status as status'
            ])
            .leftJoin('cl.voucherId', 'vr')
            .leftJoin(BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.client_id='${req.clientId}'`)
            .andWhere(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
            .groupBy(`vr.voucher_id `)
            .getRawMany();
        return query;
    }

    async getSearchDetailClient(req: ClientSearchDto) {
        const query = this.createQueryBuilder('cl')
            .select([
                'cl.id AS id',
                'cl.client_id AS clientId',
                'cl.phone_number AS phoneNumber',
                'cl.client_photo AS clientPhoto',
                'cl.name AS name',
                'cl.GST_number AS gstNumber',
                'br.name AS branch',
                'br.id AS branchId',
                'cl.email AS email',
                'cl.address AS address',
                'cl.state AS state',
                'cl.status as status'
            ])
            .leftJoin('cl.voucherId', 'vr')
            .leftJoin(BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
        if (req.clientId) {
            query.andWhere('cl.client_id = :clientId', { clientId: req.clientId });
        }
        if (req.name) {
            query.andWhere('cl.name LIKE :name', { name: `%${req.name}%` });
        }
        if (req.userName) {
            query.andWhere('cl.user_name LIKE :userName', { userName: `%${req.userName}%` });
        }
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }
        const result = await query
            .groupBy(`vr.voucher_id, cl.client_id, cl.phone_number, cl.name,  vr.payment_status, vr.amount, br.name, cl.email,cl.address, vr.name, vr.generation_date, vr.product_type`)
            .getRawMany();

        return result;
    }

}