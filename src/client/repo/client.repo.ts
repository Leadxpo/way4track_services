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
                'cl.status as status',
                'cl.created_by as createdBy'
            ])
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
                'br.name AS branchName',
                'cl.email AS email',
                'cl.address AS address',
                'cl.state AS state',
                'cl.status as status',
                'cl.created_by as createdBy'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.client_id='${req.clientId}'`)
            .andWhere(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
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
                'cl.status as status',
                'cl.created_by as createdBy',
                'cl.created_at as createdDate'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
            .orderBy('cl.created_at', 'DESC')
        if (req.clientId) {
            query.andWhere('cl.client_id = :clientId', { clientId: req.clientId });
        }
        if (req.name) {
            query.andWhere('cl.name LIKE :name', { name: `%${req.name}%` });
        }
        if (req.userName) {
            query.andWhere('cl.user_name LIKE :userName', { userName: `%${req.userName}%` });
        }
        if (req.phoneNumber) {
            query.andWhere('cl.phone_number LIKE :phoneNumber', { phoneNumber: `%${req.phoneNumber}%` });
        }
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }
        if (req.fromDate) {
            query.andWhere('cl.created_at >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('cl.created_at <= :toDate', { toDate: req.toDate });
        }

        const result = await query
            .groupBy(` cl.client_id, cl.phone_number, cl.name, br.name, cl.email,cl.address`)
            .getRawMany();

        return result;
    }

}